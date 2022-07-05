/* eslint-disable no-useless-constructor */
export default class BadRequestErr extends Error {
  public readonly statusCode: number = 400;

  constructor(message: string) {
    super(message);
  }
}
