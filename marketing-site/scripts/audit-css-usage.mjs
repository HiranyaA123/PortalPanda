import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import postcss from 'postcss';

const traverse = traverseModule.default || traverseModule;
const fix = process.argv.includes('--fix');

// Classes that are real but that no static scan can be trusted to prove are
// real - state flags toggled at runtime, and anything a future refactor might
// express in a way the AST walker below does not model. `--fix` will never
// remove these. Add to this list rather than loosening the walker.
const KEEP = new Set([
  'reveal', 'is-visible', 'is-active', 'is-inactive', 'is-selected',
  'is-wip', 'is-thread-reached', 'menu-open', 'nav--open', 'header--scrolled',
]);

const used = new Set();
const dynamicPrefixes = new Set();
const sourceStrings = new Set();
const sourceFiles = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      walk(path);
    } else if (/\.(jsx|js)$/.test(name)) {
      sourceFiles.push(path);
    }
  }
}

function addClasses(value) {
  value
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => /^[A-Za-z][A-Za-z0-9_-]*$/.test(token))
    .forEach((token) => used.add(token));
}

function collectExpression(node) {
  if (!node) return;
  if (node.type === 'StringLiteral') {
    addClasses(node.value);
    return;
  }
  if (node.type === 'TemplateLiteral') {
    node.quasis.forEach((quasi, index) => {
      const value = quasi.value.cooked || '';
      addClasses(value);
      if (index < node.expressions.length) {
        const prefix = value.split(/\s+/).at(-1);
        if (/^[A-Za-z][A-Za-z0-9_-]*--$/.test(prefix)) dynamicPrefixes.add(prefix);
      }
    });
    node.expressions.forEach(collectExpression);
    return;
  }
  if (node.type === 'ConditionalExpression') {
    collectExpression(node.consequent);
    collectExpression(node.alternate);
    return;
  }
  if (node.type === 'LogicalExpression' || node.type === 'BinaryExpression') {
    collectExpression(node.left);
    collectExpression(node.right);
    return;
  }
  if (node.type === 'CallExpression') {
    // `cls`.trim() / value.concat(...) put the class source on the callee's
    // object, not in the argument list. Missing this is what silently deleted
    // the whole `.reveal` / `.is-visible` block: Reveal.jsx builds its class
    // with a template literal followed by .trim(), so the literal was never
    // scanned and every class only named inside it looked unused.
    if (node.callee?.type === 'MemberExpression') collectExpression(node.callee.object);
    node.arguments.forEach(collectExpression);
  }
}

walk('src');
for (const file of sourceFiles) {
  const source = readFileSync(file, 'utf8');
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  traverse(ast, {
    StringLiteral(path) {
      const value = path.node.value.trim();
      if (/^[A-Za-z][A-Za-z0-9_-]*$/.test(value)) sourceStrings.add(value);
    },
    JSXAttribute(path) {
      if (path.node.name?.name !== 'className') return;
      const value = path.node.value;
      if (value?.type === 'StringLiteral') addClasses(value.value);
      if (value?.type === 'JSXExpressionContainer') collectExpression(value.expression);
    },
    CallExpression(path) {
      const callee = path.node.callee;
      if (
        callee?.type === 'MemberExpression'
        && callee.object?.type === 'MemberExpression'
        && callee.object.property?.name === 'classList'
      ) {
        path.node.arguments.forEach(collectExpression);
      }
    },
  });
}

const cssPath = 'src/index.css';
const original = readFileSync(cssPath, 'utf8');
const root = postcss.parse(original, { from: cssPath });
const classPattern = /\.([A-Za-z][A-Za-z0-9_-]*)/g;
const isUsed = (name) => KEEP.has(name)
  || used.has(name)
  || sourceStrings.has(name)
  || [...dynamicPrefixes].some((prefix) => name.startsWith(prefix));
const defined = new Set();

function splitSelectors(selectorList) {
  const selectors = [];
  let start = 0;
  let depth = 0;
  let quote = '';

  for (let index = 0; index < selectorList.length; index += 1) {
    const character = selectorList[index];
    if (quote) {
      if (character === quote && selectorList[index - 1] !== '\\') quote = '';
      continue;
    }
    if (character === '"' || character === "'") quote = character;
    else if (character === '(' || character === '[') depth += 1;
    else if (character === ')' || character === ']') depth = Math.max(0, depth - 1);
    else if (character === ',' && depth === 0) {
      selectors.push(selectorList.slice(start, index).trim());
      start = index + 1;
    }
  }

  selectors.push(selectorList.slice(start).trim());
  return selectors.filter(Boolean);
}

root.walkRules((rule) => {
  for (const match of rule.selector.matchAll(classPattern)) defined.add(match[1]);
});

const unusedBefore = [...defined].filter((name) => !isUsed(name)).sort();
let removedRules = 0;

if (fix) {
  // Say out loud what is about to be deleted. A silent --fix is how the
  // scroll-reveal block disappeared without anyone noticing.
  if (unusedBefore.length) {
    console.log(`\nRemoving rules for ${unusedBefore.length} unreferenced class(es):`);
    console.log(unusedBefore.map((name) => `  .${name}`).join('\n'));
    console.log('');
  }

  root.walkRules((rule) => {
    const selectors = splitSelectors(rule.selector);
    const keptSelectors = selectors.filter((selector) => {
      const classes = [...selector.matchAll(classPattern)].map((match) => match[1]);
      return !classes.length || classes.every(isUsed);
    });
    removedRules += selectors.length - keptSelectors.length;
    if (!keptSelectors.length) {
      rule.remove();
    } else if (keptSelectors.length !== selectors.length) {
      rule.selector = keptSelectors.join(',\n');
    }
  });

  const animationNames = new Set();
  root.walkDecls((declaration) => {
    if (!/^animation(?:-name)?$/.test(declaration.prop)) return;
    declaration.value
      .split(/[\s,]+/)
      .filter((token) => /^[A-Za-z][A-Za-z0-9_-]*$/.test(token))
      .forEach((token) => animationNames.add(token));
  });
  root.walkAtRules((rule) => {
    if (/^(?:-webkit-)?keyframes$/.test(rule.name) && !animationNames.has(rule.params)) {
      rule.remove();
    }
  });

  let removedEmpty = true;
  while (removedEmpty) {
    removedEmpty = false;
    root.walkAtRules((rule) => {
      if (!rule.nodes?.length) {
        removedEmpty = true;
        rule.remove();
      }
    });
  }

  writeFileSync(cssPath, root.toString(), 'utf8');
}

console.log(`CSS classes defined: ${defined.size}`);
console.log(`Classes unreferenced by current source: ${unusedBefore.length}`);
if (fix) console.log(`Legacy rules removed: ${removedRules}`);
if (!fix && unusedBefore.length) console.log(unusedBefore.join('\n'));
