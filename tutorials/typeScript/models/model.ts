export interface Todo {
  id: number;
  todo: string;
  isDone: boolean;
}

export interface SingleTodoProps {
  todo: Todo;
}

export interface TodoListProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
}

export interface InputFieldProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
}
