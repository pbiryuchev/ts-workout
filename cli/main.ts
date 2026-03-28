import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Command } from 'commander';
import inquirer, { DistinctQuestion } from 'inquirer';

const padNumber = (number: number) => number.toString().padStart(3, '0');

enum Platform {
  LeetCode = 'leetcode',                  // https://leetcode.com/
  // BigFrontendDev = 'bfe',              // https://bigfrontend.dev/problem
  // CodeWars = 'codewars',               // https://www.codewars.com
  TypeChallenges = 'ts-challenges',       // https://github.com/type-challenges/type-challenges
  RxJsChallenges = 'rxjs-challenges',     // https://github.com/AngularWave/rxjs-challenge
  // RxJsNinja = 'rxjs-ninja',            // https://rxjs-course-avy.web.app/
  // ReturnTrue = 'return-true',          // https://github.com/Rafalsky/return-true-to-win
}

const platformChoices = Object.values(Platform);

const isValidNumber = (input: string): boolean => /^\d+$/.test(input);
const isValidTitle = (input: string): boolean =>
  /^[a-zA-Z0-9_\-]+$/.test(input);
const isValidURL = (input: string): boolean =>
  input === '' || /^(https?:\/\/\S+)$/.test(input);

const questions: DistinctQuestion[] = [
  {
    type: 'list',
    name: 'folder',
    message: 'Выберите платформу:',
    choices: platformChoices,
    default: Platform.LeetCode,
  },
  {
    type: 'input',
    name: 'number',
    message: 'Введите номер задачи:',
    validate: (input) =>
      isValidNumber(input) ? true : 'Введите корректный номер (число)',
  },
  {
    type: 'list',
    name: 'level',
    message: 'Выберите сложность задачи:',
    choices: ['easy', 'medium', 'hard'],
  },
  {
    type: 'input',
    name: 'title',
    message: 'Введите краткое название задачи (e.g., binary_search_task):',
    validate: (input) =>
      isValidTitle(input)
        ? true
        : 'Название должно содержать только латинские буквы, цифры, -, _',
  },
  {
    type: 'input',
    name: 'link',
    message: 'Введите ссылку на задачу (опционально):',
    default: '',
    validate: (input) =>
      isValidURL(input) ? true : 'Введите корректный URL или оставьте пустым',
  },
];

const taskMock = (link?: string) => (link ? `// ${link}\n\n` : '');

const testMock = (number: string, title: string) =>
  `import { describe, it, expect } from "vitest";

describe("${padNumber(Number(number))} - ${title}", () => {
  it("UC1", () => {
    
  });
});
`;

const createTask = async () => {
  const answers = await inquirer.prompt(questions);
  const { number, level, title, folder, link } = answers;

  const platform = folder as Platform;

  if (platform === Platform.TypeChallenges) {
    const mainFileName = `${padNumber(Number(number))}_${title}.ts`;
    const levelPath = join('tasks', platform, level);
    const mainFilePath = join(levelPath, mainFileName);

    try {
      mkdirSync(levelPath, { recursive: true });
    } catch (error) {
      console.error(`Ошибка при создании папки задачи: ${error}`);
      process.exit(1);
    }
    writeFileSync(mainFilePath, taskMock(link));
    console.log(`Файл задания ${mainFileName} создан в ${levelPath}`);
  } else {
    const folderName = `${padNumber(Number(number))}_${title}`;
    const taskPath = join('tasks', platform, level, folderName);
    const mainFileName = `${padNumber(Number(number))}.ts`;
    const testFileName = `${padNumber(Number(number))}.test.ts`;

    try {
      mkdirSync(taskPath, { recursive: true });
    } catch (error) {
      console.error(`Ошибка при создании папки задачи: ${error}`);
      process.exit(1);
    }

    const mainFilePath = join(taskPath, mainFileName);
    writeFileSync(mainFilePath, taskMock(link));

    const testFilePath = join(taskPath, testFileName);
    writeFileSync(testFilePath, testMock(number, title));

    console.log(`Папка задания ${folderName} создана с тестами: ${taskPath}`);
  }
};

const cli = new Command();

cli
  .description(
    'CLI для создания пространства решения задач на LeetCode, BFE и других платформах'
  )
  .action(createTask);

cli.parse(process.argv);
