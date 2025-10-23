document.addEventListener('DOMContentLoaded', () => {
  const app = document.createElement('main');
  app.className = 'container';

  const title = document.createElement('h1');
  title.textContent = 'ToDo List';
  app.append(title);

  const form = document.createElement('form');
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Введите задачу...';
  const button = document.createElement('button');
  button.textContent = 'Добавить';
  form.append(input, button);
  app.append(form);

  const list = document.createElement('ul');
  list.id = 'task-list';
  app.append(list);

  document.body.append(app);
});