export interface Todo {
  id: number;
  todo: string;
  isDone: boolean;
}

export interface SingleTodoProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todo: Todo;
  todos: Todo[];
}

export interface TodoListProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
}

export interface InputFieldProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
}
