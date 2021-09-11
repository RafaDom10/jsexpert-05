import {
  describe, test, expect, jest,
} from '@jest/globals';
import route from '../../src/routes.js';

describe('#Routes suite test', () => {
  const defaultParams = {
    request: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: '',
      body: {},
    },
    response: {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn(),
    },
    values: () => Object.values(defaultParams),
  };

  describe('#setSocketInstance', () => {
    test('setSocket should store io instance', () => {
      const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => {},
      };
      route.setSocketInstance(ioObj);
      expect(route.io).toStrictEqual(ioObj);
    });
  });

  describe('#handler', () => {
    test('given an inexistent route it should choose default route', async () => {
      const params = {
        ...defaultParams,
      };
      params.request.method = 'inexistent';
      await route.handler(...params.values());
      expect(params.response.end).toHaveBeenCalledWith('hello world');
    });

    test('it should set any request with CORS enable', async () => {
      const params = {
        ...defaultParams,
      };
      params.request.method = 'inexistent';
      await route.handler(...params.values());
      expect(params.response.setHeader)
        .toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
    });

    test('given method OPTIONS it should choose options route', async () => {
      const params = {
        ...defaultParams,
      };
      params.request.method = 'OPTIONS';
      await route.handler(...params.values());
      expect(params.response.writeHead).toHaveBeenCalledWith(204);
      expect(params.response.end).toHaveBeenCalled();
    });

    test('given method POST it should choose options route', async () => {
      const params = {
        ...defaultParams,
      };

      params.request.method = 'POST';
      jest.spyOn(route, route.post.name).mockResolvedValue();

      await route.handler(...params.values());
      expect(route.post).toHaveBeenCalled();
    });

    test('given method GET it should choose options route', async () => {
      const params = {
        ...defaultParams,
      };
      params.request.method = 'GET';
      jest.spyOn(route, route.get.name).mockResolvedValue();

      await route.handler(...params.values());
      expect(route.get).toHaveBeenCalled();
    });
  });

  describe('#get', () => {
    test('given method GET it should list all files downloaded', async () => {
      const params = {
        ...defaultParams,
      };

      const filesStatusesMock = [
        {
          size: '78.9 kB',
          lastModified: '2021-09-11T21:16:43.471Z',
          owner: 'rafael',
          file: 'file.txt',
        },
      ];

      jest.spyOn(route.fileHelper, route.fileHelper.getFilesStatus.name)
        .mockResolvedValue(filesStatusesMock);

      params.request.method = 'GET';
      await route.handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(200);
      expect(params.response.end).toHaveBeenCalledWith(JSON.stringify(filesStatusesMock));
    });
  });
});
