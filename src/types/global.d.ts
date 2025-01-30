declare namespace JSX {
  interface InputHTMLAttributes<T> extends React.InputHTMLAttributes<T> {
    webkitdirectory?: string | boolean;
    directory?: string | boolean;
  }
}