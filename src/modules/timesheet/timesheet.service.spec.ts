import TestProviders from '@jest-providers';
import { TimesheetRepository } from './repository/timesheet.repository';
import { TimesheetService } from './timesheet.service';
import { TimesheetDto } from './dto/timesheet.dto';
import { Timesheet } from './models/timesheet.model';

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});
describe('TimesheetService', () => {
  let service: TimesheetService;
  let timesheetRepository: TimesheetRepository;

  beforeEach(() => {
    timesheetRepository = {
      registerTime: jest.fn(),
      getLastUserRegister: jest.fn(),
      getTimesheetByUserId: jest.fn(),
      getCurrentHourById: jest.fn(),
      getLastRegisterType: jest.fn(),
    } as any;

    TestProviders.providers([
      {
        token: 'timesheetRepository',
        useValue: timesheetRepository,
      },
    ]);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TimesheetService();
  });

  describe('register time', () => {
    it('should register success', async () => {
      const timesheetDto = new TimesheetDto();

      timesheetDto.registred_date = '2020-02-20';
      timesheetDto.registred_hour = 7;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest.spyOn(timesheetRepository, 'getLastUserRegister').mockResolvedValue({});
      jest.spyOn(timesheetRepository, 'registerTime').mockResolvedValue({});

      await service.registerTime(timesheetDto, { id: 1 }, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hora registrada com sucesso',
      });
    });

    it('should register success with last timesheet', async () => {
      const timesheetDto = new TimesheetDto();

      timesheetDto.registred_date = '2020-02-20';
      timesheetDto.registred_hour = 7;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const timesheet = new Timesheet({ id: 1, registred_hour_type: false });

      jest.spyOn(timesheetRepository, 'getLastUserRegister').mockResolvedValue(timesheet);
      jest.spyOn(timesheetRepository, 'registerTime').mockResolvedValue({});

      await service.registerTime(timesheetDto, { id: 1 }, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hora registrada com sucesso',
      });
    });

    it('should register error', async () => {
      const timesheetDto = new TimesheetDto();

      timesheetDto.registred_date = '2020-02-20';
      timesheetDto.registred_hour = 7;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const timesheet = new Timesheet({ id: 1, registred_hour_type: false });

      jest.spyOn(timesheetRepository, 'getLastUserRegister').mockResolvedValue(timesheet);
      jest.spyOn(timesheetRepository, 'registerTime').mockRejectedValue(new Error('Internal Error'));

      await service.registerTime(timesheetDto, {}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal Error',
      });
    });
  });

  describe('get timesheet', () => {
    it('should get timesheet success', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const timesheetItems = [{ date: '2023-04-16 00:00:00.000', total_hours: '20:00' }];

      jest.spyOn(timesheetRepository, 'getTimesheetByUserId').mockResolvedValue(timesheetItems);

      await service.getTimesheet({ id: 1 }, { page: 0, limit: 10 }, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        paginateOptions: {
          page: 0,
          limit: 10,
        },
        items: timesheetItems,
      });
    });

    it('should get timesheet not found', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest.spyOn(timesheetRepository, 'getTimesheetByUserId').mockResolvedValue([]);

      await service.getTimesheet({ id: 1 }, { page: 0, limit: 10 }, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        paginateOptions: {
          page: 0,
          limit: 10,
        },
        items: [],
      });
    });

    it('should get timesheet error', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest.spyOn(timesheetRepository, 'getTimesheetByUserId').mockRejectedValue([]);

      await service.getTimesheet({ id: 1 }, { page: 0, limit: 10 }, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('get current hour', () => {
    it('should get current hour success', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const timesheet = { total_hours: '20:00', last_register_type: false };

      jest.spyOn(timesheetRepository, 'getLastRegisterType').mockResolvedValue(false);
      jest.spyOn(timesheetRepository, 'getCurrentHourById').mockResolvedValue(timesheet);

      await service.getCurrentHour({ id: 1 }, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(timesheet);
    });

    it('should get current hour not found', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const timesheet = { total_hours: '0h 00m', last_register_type: null };

      jest.spyOn(timesheetRepository, 'getLastRegisterType').mockResolvedValue(null);
      jest.spyOn(timesheetRepository, 'getCurrentHourById').mockResolvedValue(null);

      await service.getCurrentHour({ id: 1 }, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(timesheet);
    });

    it('should get current hour error', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest.spyOn(timesheetRepository, 'getLastRegisterType').mockRejectedValue(false);
      jest.spyOn(timesheetRepository, 'getCurrentHourById').mockRejectedValue({});

      await service.getCurrentHour({ id: 1 }, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
