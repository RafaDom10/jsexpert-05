import {
  describe, test, expect, jest,
} from '@jest/globals';
import fs from 'fs';
import FileHelper from '../../src/fileHelper.js';
import routes from '../../src/routes.js';

describe('#FileHelper', () => {
  describe('#getFileStatus', () => {
    test('it should return files statuses in correct format', async () => {
      const statMock = {
        dev: 2050,
        mode: 33204,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 11280665,
        size: 78902,
        blocks: 160,
        atimeMs: 1631395003714.795,
        mtimeMs: 1631395003470.7903,
        ctimeMs: 1631395003470.7903,
        birthtimeMs: 1631395003470.7903,
        atime: '2021-09-11T21:16:43.715Z',
        mtime: '2021-09-11T21:16:43.471Z',
        ctime: '2021-09-11T21:16:43.471Z',
        birthtime: '2021-09-11T21:16:43.471Z',
      };

      const mockUser = 'rafael';
      process.env.User = mockUser;
      const fileName = 'file.png';

      jest.spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([fileName]);

      jest.spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock);

      const result = await FileHelper.getFilesStatus('/tmp');

      const expectedResult = [
        {
          size: '78.9 kB',
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: fileName,
        },
      ];

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${fileName}`);
      expect(result).toMatchObject(expectedResult);
    });
  });
});
