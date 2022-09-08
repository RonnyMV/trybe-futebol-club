export default class ErrorMiddleware extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
