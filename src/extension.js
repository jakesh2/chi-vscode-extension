const vscode = require('vscode');
const path = require('path');
const { execFile } = require('child_process');

let activeChiExecution;
let chiTerminal;
let isChiRunning = false;
let runStatusItem;
let translateStatusItem;
let cancelStatusItem;

const KEYWORD_ITEMS = [
  ['ika', 'Declare a variable: ika name = value', 'ika ${1:name} = ${2:value}'],
  ['ngati', 'If statement', 'ngati ${1:condition}:\n    ${2:onetsa("zoona")}'],
  ['kapena_ngati', 'Else-if statement', 'kapena_ngati ${1:condition}:\n    ${2:onetsa("condition")}'],
  ['sizoona', 'Else statement', 'sizoona:\n    ${1:onetsa("zabodza")}'],
  ['yesani', 'While loop', 'yesani ${1:condition}:\n    ${2:onetsa("loop")}'],
  ['bwereza', 'For loop', 'bwereza ${1:item} mu ${2:items}:\n    ${3:onetsa($1)}'],
  ['mu', 'In operator used by for loops'],
  ['chita', 'Block starter alternative to colon'],
  ['leka', 'Break out of a loop'],
  ['pitilizani', 'Continue to the next loop iteration'],
  ['panga', 'Define a function', 'panga ${1:name}(${2:params}):\n    ${3:bweza palibe}'],
  ['bweza', 'Return from a function', 'bweza ${1:value}'],
  ['kuyesera', 'Try block', 'kuyesera:\n    ${1:onetsa("try")}\nzakanika vuto_lililonse chifukwa ${2:error}:\n    ${3:onetsa($2)}'],
  ['zakanika', 'Except block'],
  ['pomaliza', 'Finally block', 'pomaliza:\n    ${1:onetsa("done")}'],
  ['chifukwa', 'Capture exception variable']
];

const CONSTANT_ITEMS = [
  ['zoona', 'Boolean true'],
  ['zabodza', 'Boolean false'],
  ['palibe', 'Null value']
];

const OPERATOR_ITEMS = [
  ['wafanana', 'Comparison: equal to (==)'],
  ['wasiyana', 'Comparison: not equal to (!=)'],
  ['wapambana', 'Comparison: greater than (>)'],
  ['wachepa', 'Comparison: less than (<)'],
  ['wafananitsa', 'Comparison: greater than or equal to (>=)'],
  ['wachepetsedwa', 'Comparison: less than or equal to (<=)'],
  ['komanso', 'Logical and'],
  ['kapena', 'Logical or'],
  ['osati', 'Logical not']
];

const BUILTIN_FUNCTIONS = [
  ['onetsa', 'Print/display values', 'onetsa(${1:value})'],
  ['funsani', 'Read user input', 'funsani(${1:"Prompt: "})'],
  ['mtundu', 'Get value type', 'mtundu(${1:value})'],
  ['kukula', 'Get length/size', 'kukula(${1:value})'],
  ['mawu', 'Convert to string', 'mawu(${1:value})'],
  ['manambala', 'Convert to float', 'manambala(${1:value})'],
  ['manambala_olekeza', 'Convert to integer', 'manambala_olekeza(${1:value})'],
  ['ndandanda', 'Create a list', 'ndandanda(${1:items})'],
  ['kaundula', 'Create a dictionary', 'kaundula(${1:key}, ${2:value})'],
  ['mphamvu', 'Power function', 'mphamvu(${1:base}, ${2:exponent})'],
  ['chotsalira', 'Modulo/remainder', 'chotsalira(${1:dividend}, ${2:divisor})'],
  ['muzu', 'Square root', 'muzu(${1:number})'],
  ['chopanda', 'Absolute value', 'chopanda(${1:number})'],
  ['pansi', 'Floor', 'pansi(${1:number})'],
  ['pamwamba', 'Ceiling', 'pamwamba(${1:number})'],
  ['zungulira', 'Round number', 'zungulira(${1:number}, ${2:digits})'],
  ['phatikiza', 'Sum numbers', 'phatikiza(${1:values})'],
  ['pakatikati', 'Average numbers', 'pakatikati(${1:values})'],
  ['chachikulu', 'Maximum value', 'chachikulu(${1:values})'],
  ['chachingono', 'Minimum value', 'chachingono(${1:values})'],
  ['sanja', 'Sort data', 'sanja(${1:data}, ${2:"koyamba"})'],
  ['chapakati', 'Median value', 'chapakati(${1:values})'],
  ['yofala', 'Mode value', 'yofala(${1:values})'],
  ['tsegula', 'Open a file', 'tsegula(${1:"file.txt"}, ${2:"werenga"})'],
  ['werenga_zonse', 'Read an entire file', 'werenga_zonse(${1:"file.txt"})'],
  ['lemba_mu_file', 'Write content to a file', 'lemba_mu_file(${1:"file.txt"}, ${2:content})'],
  ['pezani_file', 'Check if a file exists', 'pezani_file(${1:"file.txt"})']
];

const METHOD_ITEMS = [
  ['chotsani_mimpata', 'Remove whitespace from both ends', 'chotsani_mimpata()'],
  ['gawani', 'Split string', 'gawani(${1:separator})'],
  ['lumikizani', 'Join list into string', 'lumikizani(${1:list})'],
  ['sinthani', 'Replace substring', 'sinthani(${1:old}, ${2:new})'],
  ['zikuluzikulu', 'Convert to uppercase', 'zikuluzikulu()'],
  ['zingonozingono', 'Convert to lowercase', 'zingonozingono()'],
  ['yoyamba_ndi', 'Check string prefix', 'yoyamba_ndi(${1:prefix})'],
  ['imamaliza_ndi', 'Check string suffix', 'imamaliza_ndi(${1:suffix})'],
  ['ili_nacho', 'Check containment', 'ili_nacho(${1:value})'],
  ['kutalika', 'Get string length', 'kutalika()'],
  ['bwezerani', 'Reverse string', 'bwezerani()'],
  ['bwerezani', 'Repeat string', 'bwerezani(${1:n})'],
  ['dulaini', 'Slice string', 'dulaini(${1:start}, ${2:end})'],
  ['onjezera', 'Append item to list', 'onjezera(${1:item})'],
  ['lowetsa', 'Insert item into list', 'lowetsa(${1:index}, ${2:item})'],
  ['chotsa', 'Remove item from list', 'chotsa(${1:item})'],
  ['tulutsa', 'Pop item from list', 'tulutsa(${1:index})'],
  ['funafuna', 'Find index of item', 'funafuna(${1:item})'],
  ['werengera', 'Count occurrences', 'werengera(${1:item})'],
  ['ika_pa', 'Set dictionary key', 'ika_pa(${1:key}, ${2:value})'],
  ['peza', 'Get dictionary value', 'peza(${1:key})'],
  ['peza_kapena', 'Get dictionary value with default', 'peza_kapena(${1:key}, ${2:default})'],
  ['ali_nacho', 'Check dictionary key', 'ali_nacho(${1:key})'],
  ['chotsa_pa', 'Remove dictionary key', 'chotsa_pa(${1:key})'],
  ['chotsani_zonse', 'Clear all items', 'chotsani_zonse()'],
  ['makiyi', 'Get dictionary keys', 'makiyi()'],
  ['mavalu', 'Get dictionary values', 'mavalu()'],
  ['zonse', 'Get dictionary items', 'zonse()'],
  ['kopani', 'Copy dictionary', 'kopani()'],
  ['sanjirani', 'Merge dictionary', 'sanjirani(${1:other})'],
  ['werenga', 'Read from file', 'werenga()'],
  ['werenga_mizere', 'Read file lines', 'werenga_mizere()'],
  ['lemba', 'Write to file', 'lemba(${1:content})'],
  ['lemba_mzere', 'Write a line to file', 'lemba_mzere(${1:content})'],
  ['tseka', 'Close file', 'tseka()']
];

const EXCEPTION_ITEMS = [
  'vuto_la_nambala',
  'vuto_la_mtundu',
  'vuto_la_ndandanda',
  'cholakwika_kiyi',
  'vuto_la_dzina',
  'vuto_la_kugawa',
  'vuto_la_kukumbukira',
  'vuto_la_fayilo',
  'vuto_la_chilolezo',
  'vuto_lililonse'
];

function makeSimpleCompletion(label, detail, kind) {
  const item = new vscode.CompletionItem(label, kind);
  item.detail = detail;
  return item;
}

function makeFunctionCompletion(label, detail, insertText) {
  const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Function);
  item.detail = detail;
  item.insertText = new vscode.SnippetString(insertText);
  return item;
}

function makeKeywordCompletion(label, detail, insertText) {
  const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Keyword);
  item.detail = detail;
  if (insertText) {
    item.insertText = new vscode.SnippetString(insertText);
  }
  return item;
}

function scanDocumentSymbols(document) {
  const text = document.getText();
  const completions = [];
  const seen = new Set();
  const variablePattern = /^\s*ika\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/gm;
  const functionPattern = /^\s*panga\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/gm;
  let match;

  while ((match = variablePattern.exec(text)) !== null) {
    const name = match[1];
    if (!seen.has(`var:${name}`)) {
      seen.add(`var:${name}`);
      completions.push(makeSimpleCompletion(name, 'Chi variable in this file', vscode.CompletionItemKind.Variable));
    }
  }

  while ((match = functionPattern.exec(text)) !== null) {
    const name = match[1];
    const params = match[2].trim();
    if (!seen.has(`fn:${name}`)) {
      seen.add(`fn:${name}`);
      const snippetArgs = params
        ? params.split(',').map((param, index) => `\${${index + 1}:${param.trim() || `arg${index + 1}`}}`).join(', ')
        : '';
      completions.push(makeFunctionCompletion(name, `Chi function in this file (${params})`, `${name}(${snippetArgs})`));
    }
  }

  return completions;
}

function provideCompletionItems(document, position) {
  const linePrefix = document.lineAt(position).text.slice(0, position.character);

  if (/\.\s*[A-Za-z_]*$/.test(linePrefix)) {
    return METHOD_ITEMS.map(([label, detail, insertText]) => makeFunctionCompletion(label, detail, insertText));
  }

  const items = [
    ...KEYWORD_ITEMS.map(([label, detail, insertText]) => makeKeywordCompletion(label, detail, insertText)),
    ...CONSTANT_ITEMS.map(([label, detail]) => makeSimpleCompletion(label, detail, vscode.CompletionItemKind.Constant)),
    ...OPERATOR_ITEMS.map(([label, detail]) => makeSimpleCompletion(label, detail, vscode.CompletionItemKind.Operator)),
    ...BUILTIN_FUNCTIONS.map(([label, detail, insertText]) => makeFunctionCompletion(label, detail, insertText)),
    ...EXCEPTION_ITEMS.map((label) => makeSimpleCompletion(label, 'Chi exception type', vscode.CompletionItemKind.Class)),
    ...scanDocumentSymbols(document)
  ];

  return items;
}

function getActiveDocument() {
  const editor = vscode.window.activeTextEditor;
  return editor ? editor.document : undefined;
}

function getWorkspaceFolder(document) {
  const folder = vscode.workspace.getWorkspaceFolder(document.uri);
  return folder ? folder.uri.fsPath : path.dirname(document.uri.fsPath);
}

function isChiDocument(document) {
  return document && document.uri.scheme === 'file' && path.extname(document.uri.fsPath).toLowerCase() === '.chi';
}

function isPythonDocument(document) {
  return document && document.uri.scheme === 'file' && path.extname(document.uri.fsPath).toLowerCase() === '.py';
}

function quoteForShell(value) {
  if (process.platform === 'win32') {
    return `"${value.replace(/"/g, '\\"')}"`;
  }

  return `'${value.replace(/'/g, "'\\''")}'`;
}

function checkChiInstalled() {
  return new Promise((resolve) => {
    const command = process.platform === 'win32' ? 'where' : 'which';
    execFile(command, ['chi'], { windowsHide: true }, (error) => {
      resolve(!error);
    });
  });
}

async function ensureChiInstalled() {
  const installed = await checkChiInstalled();
  if (!installed) {
    vscode.window.showErrorMessage('Chi is not installed or is not available on PATH. Install Chi, then restart VS Code or update your PATH.');
  }
  return installed;
}

function setChiRunning(value) {
  isChiRunning = value;
  vscode.commands.executeCommand('setContext', 'chi.isRunning', value);
  updateStatusButtons();
}

function getChiTerminal(document) {
  if (!chiTerminal || chiTerminal.exitStatus) {
    chiTerminal = vscode.window.createTerminal({
      name: 'Chi',
      cwd: getWorkspaceFolder(document)
    });
  }

  return chiTerminal;
}

async function runTerminalCommand(document, command) {
  if (isChiRunning) {
    vscode.window.showInformationMessage('Chi is already running. Cancel it before starting another command.');
    return;
  }

  if (!(await ensureChiInstalled())) {
    return;
  }

  const terminal = getChiTerminal(document);
  terminal.show();
  terminal.sendText(command);
  activeChiExecution = terminal;
  setChiRunning(true);
}

async function saveDocument(document) {
  if (document.isDirty) {
    await document.save();
  }
}

async function runCurrentFile() {
  const document = getActiveDocument();
  if (!isChiDocument(document)) {
    vscode.window.showInformationMessage('Open a .chi file before running Chi.');
    return;
  }

  await saveDocument(document);
  await runTerminalCommand(document, `chi run ${quoteForShell(document.uri.fsPath)}`);
}

async function translateCurrentFile() {
  const document = getActiveDocument();
  if (!isChiDocument(document) && !isPythonDocument(document)) {
    vscode.window.showInformationMessage('Open a .chi or .py file before translating.');
    return;
  }

  await saveDocument(document);

  const filePath = document.uri.fsPath;
  const extension = path.extname(filePath).toLowerCase();
  const outputPath = filePath.slice(0, -extension.length) + (extension === '.chi' ? '.py' : '.chi');
  const fromLanguage = extension === '.chi' ? 'chi' : 'python';
  const toLanguage = extension === '.chi' ? 'python' : 'chi';

  const command = [
    'chi translate',
    quoteForShell(filePath),
    '--from',
    fromLanguage,
    '--to',
    toLanguage,
    '--output',
    quoteForShell(outputPath)
  ].join(' ');

  await runTerminalCommand(document, command);
}

function cancelExecution() {
  if (!activeChiExecution || !isChiRunning) {
    vscode.window.showInformationMessage('No Chi command is currently running.');
    return;
  }

  if (activeChiExecution && typeof activeChiExecution.sendText === 'function') {
    activeChiExecution.show();
    activeChiExecution.sendText('\x03', false);
  }

  setChiRunning(false);
}

function updateStatusButtons() {
  const document = getActiveDocument();
  const showRun = isChiDocument(document);
  const showTranslate = isChiDocument(document) || isPythonDocument(document);

  runStatusItem.text = '$(play) Run Chi';
  runStatusItem.tooltip = 'Run current Chi file';
  runStatusItem.command = 'chi.runCurrentFile';

  translateStatusItem.text = '$(sync) Translate Chi';
  translateStatusItem.tooltip = 'Translate current .chi file to Python, or current .py file to Chi';
  translateStatusItem.command = 'chi.translateCurrentFile';

  cancelStatusItem.text = '$(debug-stop) Cancel Chi';
  cancelStatusItem.tooltip = 'Send Ctrl+C to the Chi terminal';
  cancelStatusItem.command = 'chi.cancelExecution';

  if (showRun && !isChiRunning) {
    runStatusItem.show();
  } else {
    runStatusItem.hide();
  }

  if (showTranslate && !isChiRunning) {
    translateStatusItem.show();
  } else {
    translateStatusItem.hide();
  }

  if (showTranslate && isChiRunning) {
    cancelStatusItem.show();
  } else {
    cancelStatusItem.hide();
  }
}

function activate(context) {
  const provider = vscode.languages.registerCompletionItemProvider(
    { language: 'chi', scheme: 'file' },
    { provideCompletionItems },
    '.'
  );

  runStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 102);
  translateStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 101);
  cancelStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

  context.subscriptions.push(
    provider,
    runStatusItem,
    translateStatusItem,
    cancelStatusItem,
    vscode.commands.registerCommand('chi.runCurrentFile', runCurrentFile),
    vscode.commands.registerCommand('chi.translateCurrentFile', translateCurrentFile),
    vscode.commands.registerCommand('chi.cancelExecution', cancelExecution),
    vscode.window.onDidCloseTerminal((terminal) => {
      if (terminal === chiTerminal) {
        activeChiExecution = undefined;
        chiTerminal = undefined;
        setChiRunning(false);
      }
    }),
    vscode.window.onDidChangeActiveTextEditor(updateStatusButtons),
    vscode.workspace.onDidOpenTextDocument(updateStatusButtons),
    vscode.workspace.onDidCloseTextDocument(updateStatusButtons)
  );

  if (vscode.window.onDidEndTerminalShellExecution) {
    context.subscriptions.push(
      vscode.window.onDidEndTerminalShellExecution((event) => {
        if (event.terminal === chiTerminal) {
          activeChiExecution = undefined;
          setChiRunning(false);
        }
      })
    );
  }

  setChiRunning(false);
  updateStatusButtons();
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
