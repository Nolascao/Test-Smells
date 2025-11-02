const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
nome: 'Fulano de Tal',
email: 'fulano@teste.com',
idade: 25,
};

describe('UserService - Suíte de Testes Limpa', () => {
let userService;

beforeEach(() => {
  userService = new UserService();
  userService._clearDB();
});

test('deve criar um usuário com ID definido', () => {
  const { nome, email, idade } = dadosUsuarioPadrao;

  const usuarioCriado = userService.createUser(nome, email, idade);

  expect(usuarioCriado.id).toBeDefined();
  expect(usuarioCriado.nome).toBe(nome);
  expect(usuarioCriado.email).toBe(email);
  expect(usuarioCriado.idade).toBe(idade);
});

test('deve criar um usuário com status ativo por padrão', () => {
  const { nome, email, idade } = dadosUsuarioPadrao;

  const usuarioCriado = userService.createUser(nome, email, idade);

  expect(usuarioCriado.status).toBe('ativo');
});

test('deve lançar erro ao criar usuário menor de idade', () => {
  const nome = 'Menor';
  const email = 'menor@email.com';
  const idadeMenor = 17;

  expect(() => {
    userService.createUser(nome, email, idadeMenor);
  }).toThrow('O usuário deve ser maior de idade.');
});

test('deve buscar um usuário existente por ID', () => {
  const { nome, email, idade } = dadosUsuarioPadrao;
  const usuarioCriado = userService.createUser(nome, email, idade);

  const usuarioBuscado = userService.getUserById(usuarioCriado.id);

  expect(usuarioBuscado).toBeDefined();
  expect(usuarioBuscado.id).toBe(usuarioCriado.id);
  expect(usuarioBuscado.nome).toBe(nome);
  expect(usuarioBuscado.email).toBe(email);
});

test('deve retornar null ao buscar usuário inexistente', () => {
const idInexistente = 'id-que-nao-existe';

const resultado = userService.getUserById(idInexistente);

expect(resultado).toBeNull();
});

test('deve desativar um usuário comum com sucesso', () => {
  const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

  const resultado = userService.deactivateUser(usuarioComum.id);

  expect(resultado).toBe(true);
});

test('deve alterar status para inativo ao desativar usuário comum', () => {
  const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

  userService.deactivateUser(usuarioComum.id);
  const usuarioAtualizado = userService.getUserById(usuarioComum.id);

  expect(usuarioAtualizado.status).toBe('inativo');
});

test('deve impedir desativação de usuário administrador', () => {
  const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

  const resultado = userService.deactivateUser(usuarioAdmin.id);

  expect(resultado).toBe(false);
});

test('deve manter status ativo ao tentar desativar administrador', () => {
  const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

  userService.deactivateUser(usuarioAdmin.id);
  const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

  expect(usuarioAtualizado.status).toBe('ativo');
});

test('deve gerar relatório contendo título', () => {
  userService.createUser('Alice', 'alice@email.com', 28);

  const relatorio = userService.generateUserReport();

  expect(relatorio).toContain('Relatório de Usuários');
});

test('deve incluir nome do usuário no relatório', () => {
  const nome = 'Alice';
  userService.createUser(nome, 'alice@email.com', 28);

  const relatorio = userService.generateUserReport();

  expect(relatorio).toContain(nome);
});

test('deve incluir status do usuário no relatório', () => {
  userService.createUser('Alice', 'alice@email.com', 28);

  const relatorio = userService.generateUserReport();

  expect(relatorio).toContain('ativo');
});

test('deve incluir todos os usuários cadastrados no relatório', () => {
  const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
  const usuario2 = userService.createUser('Bob', 'bob@email.com', 32);

  const relatorio = userService.generateUserReport();

  expect(relatorio).toContain(usuario1.nome);
  expect(relatorio).toContain(usuario2.nome);
});

test('deve retornar relatório mesmo quando não há usuários', () => {
  const relatorio = userService.generateUserReport();

  expect(relatorio).toBeTruthy();
  expect(typeof relatorio).toBe('string');
  expect(relatorio).toContain('Relatório de Usuários');
});

test('deve retornar relatório indicando que não há usuários cadastrados', () => {
const relatorio = userService.generateUserReport();

expect(typeof relatorio).toBe('string');
expect(relatorio).toContain('Relatório de Usuários');
});

});