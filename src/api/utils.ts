import axios, {AxiosError} from 'axios';

interface IApiInterface {
  type: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  token?: string;
  data?: Object;
  formData?: boolean;
}

export const reactApi = async (body: IApiInterface) => {
  let instance;
  body?.token === ''
    ? (instance = axios.create({}))
    : (instance = axios.create({
        headers: {
          Authorization: 'Bearer ' + body?.token, // Added space after 'Bearer'
          accept: '*/*',
          'Content-Type': body?.formData
            ? 'multipart/form-data'
            : 'application/json',
        },
      }));

  const options = {
    method: body?.type,
    url: body.url,
    data: body?.type !== 'GET' ? body?.data : undefined,
  };

  try {
    const response = await instance(options);

    if (response?.data?.status === 'Authorization not found') {
      // You can't use window.location in React Native. You should handle navigation differently.
      // You can use React Navigation or another navigation library.
      // For simplicity, here's a placeholder to show how to navigate to '/sign-in' in React Native.
      // Replace this with the appropriate navigation method for your project.
      // Example: navigation.navigate('SignInScreen');
    }

    return response;
  } catch (error) {
    // @ts-ignore
    if (error?.response?.status === 401) {
      // Handle the 401 error here.
    }
    throw error; // Rethrow the error so it can be caught by the caller if needed.
  }
};

export const handleAxiosError = (e: AxiosError) => {
  return e;
};
