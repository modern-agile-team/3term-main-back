import { ExampleType } from './example.swagger';

export const apiResponse: any = {
  success: (
    description: string,
    statusCode: number,
    msg: string,
    response?: any,
  ) => {
    const exampleObj: ExampleType = {
      success: true,
      date: new Date().toLocaleString(),
      statusCode,
      msg,
      response,
    };

    return {
      description,
      schema: {
        example: exampleObj,
      },
    };
  },

  error: (
    description: string,
    statusCode: number,
    msg: string,
    err: string,
  ) => {
    const exampleObj: ExampleType = {
      success: false,
      date: new Date().toLocaleString(),
      statusCode,
      msg,
      err,
    };

    return {
      description,
      schema: {
        example: exampleObj,
      },
    };
  },
};
