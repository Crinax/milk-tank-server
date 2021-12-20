import Logger from '../../Logger';
import APIResponse from './APIResponse';
import mongoose, { Schema } from 'mongoose';
import { Tanks, Journal, Users } from './Models';

class API {
	public static DBHost: string = 'mongodb://localhost:27017/TanksDB';
  public static connection: typeof mongoose;

	public static async connect(): Promise<APIResponse> {
		try {
      API.connection = await mongoose.connect('mongodb://localhost:27017/TanksDB');
      
      Logger.log('DB connected successfully');
    } catch (err) {
      Logger.error('Error DB connection');
      console.log(err);
      
      return APIResponse.error(500, 'Cannot connect to database');
    }

    if ((await Tanks.find()).length === 0)
      if (!(await API.createTanks()))
        return APIResponse.error(500, 'Cannot create tanks. Check server log file');

    return APIResponse.ok('Database connected successfully');
	}

  public static async getJournal() {
    try {
      const journal = await Journal.find().sort(['litters', 1]);

      Logger.log('Journal sended successfully');

      return APIResponse.ok(journal);
    } catch (err) {
      Logger.error('Error getting journal');
      console.log(err);

      return APIResponse.error(500, 'Cannot get journal');
    }
  }

  public static async getUsers() {
    try {
      const users = await Users.find().populate('journal');

      Logger.log('Users sended successfully');

      return APIResponse.ok(users);
    } catch (err) {
      Logger.error('Error getting users');
      console.log(err);

      return APIResponse.error(500, 'Cannot get users');
    }
  }

  public static async auth(name?: string): Promise<APIResponse> {
    if (!name)
      return APIResponse.error(400, 'Request should have "name" option');

    const pouringer = new Users({ name });
    try {
      await pouringer.save();

      Logger.log(`Created user: ${name}_${pouringer._id}`);

      return APIResponse.ok(pouringer._id);
    } catch (err) {
      Logger.error('Error user create');
      console.log(err);

      return APIResponse.error(500, 'Cannot create user. Check server log file');
    }
  }

  public static async fillTank(id?: Schema.Types.ObjectId, litters?: number): Promise<APIResponse> {
    if (!id || !litters)
      return APIResponse.error(400, 'Request should have "litters" option');
    if (litters < 1 || litters % 1 !== 0)
      return APIResponse.error(415, '"litters" options should be positive integer number');

    const incompleteTank = await Tanks.findOne({ litters: { $lt: 300 } });
    
    if (incompleteTank) {
      const requiredLitters = 300 - incompleteTank.litters;
      const littersToFill = requiredLitters < litters ? requiredLitters : litters

      if (!await API.updateTank(incompleteTank._id, incompleteTank.litters + littersToFill))
        return APIResponse.error(500, 'Cannot update tank. Check server log file');
      if (!await API.addRecord(id, littersToFill, incompleteTank._id))
        return APIResponse.error(500, 'Cannot add record to journal. Check server log file');
      
      if (requiredLitters < litters)
        API.fillTank(id, litters - requiredLitters)
      
        return APIResponse.ok('Tank(-s) filled successfully');
    }

    return APIResponse.error(409, 'Tanks are full');
  }

  private static async updateTank(tankId: Schema.Types.ObjectId, litters: number): Promise<boolean> {
    try {
      await Tanks.updateOne({ _id: tankId }, { litters });
      
      const tank = await Tanks.findById(tankId);
      
      if (tank) {
        Logger.log(`Update tank: ${tankId}. Current volume: ${tank.litters}`);
        
        return true;
      } else {
        Logger.error(`Error tank ${tankId} not found`);

        return false;
      }
    } catch (err) {
      Logger.error('Error tank update');
      console.log(err);
      
      return false;
    }
  }

  private static async addRecord(userId: Schema.Types.ObjectId, litters: number, tankId: Schema.Types.ObjectId): Promise<boolean> {
    try {
      const journalRecord = new Journal({
        userId,
        litters,
        tankId,
      });

      journalRecord.save();
      Logger.log(`Added journal record: User ${userId} filled the tank ${tankId} for ${litters}`);

      return true;
    } catch (err) {
      Logger.error(`Error added journal record`);
      console.log(err);

      return false;
    }
  }

  private static async createTanks(): Promise<boolean> {
    try {
      Tanks.insertMany([
        { litters: 0 },
        { litters: 0 },
        { litters: 0 },
        { litters: 0 },
        { litters: 0 },
      ]);

      Logger.log('Tanks was created');

      return true;
    } catch (err) {
      Logger.error('Create tanks error')
      console.log(err);

      return false;
    }
  }

}

export default API;