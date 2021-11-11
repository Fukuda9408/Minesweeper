import "reflect-metadata";
import { createConnection } from "typeorm";
import { TimeRecord } from "./entity/TimeRecord";

createConnection().then(async (connection) => {
  let timeRecord = new TimeRecord()
  timeRecord.name = "Takumi"
  timeRecord.time = 35

  let timeRecordRepository = connection.getRepository(TimeRecord)
  await timeRecordRepository.save(timeRecord)
  console.log("Time Record has been saved")

  let savedTimeRecord = await timeRecordRepository.find()
  console.log("All time record from the db ", savedTimeRecord)
})
.catch((error) => console.log(error));
