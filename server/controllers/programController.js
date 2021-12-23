//~~~~~~~~~INCLUDES~~~~~~~~~~~~
const Program = require('../models/programs');
const Log = require('./logger');
//~~~~~~~EXPORTED FUNCTIONS~~~~~~~~~~
/*
GET REQUEST: getAllPrograms()
GET REQUEST: getSpecificProgram(path = '/id')
POST REQUEST: createProgram(body = all params except for id)
PUT REQUEST: updateProgram(path = '/id', body = all new params)
DELETE REQUEST: deleteProgram(path = '/id')
*/
exports.programController = {
    async getAllPrograms(req, res) {
        Log.logger.info(`PROGRAM CONTROLLER REQ: Get all programs`);
        const answer = await Program.find()
            .catch(err => {
                Log.logger.info(`PROGRAM CONTROLLER ERROR: getting the data from db ${err}`);
                res.status(500).json({status: 500 , msg: `Server error`});
            });
        if (answer.length!=0){
            Log.logger.info(`PROGRAM CONTROLLER RES: Get all programs`);
            res.json(answer);
        }
        else{
            Log.logger.info(`PROGRAM CONTROLLER RES: no programs in DB`);
            res.status(404).json({status: 404 , msg: `No programs in DB`});
        }
    },
    async getSpecificProgram(req, res) {
        const ProgramId = req.path.substring(1)
        Log.logger.info(`PROGRAM CONTROLLER REQ: Get specific program number ${ProgramId}`);
        if (isNaN(ProgramId)){
            Log.logger.info(`PROGRAM CONTROLLER RES: input is nan error "${ProgramId}"`);
            res.status(401).json({status: 400 , msg: `Input is nan error "${ProgramId}"`});
        }
        else{
            var ProgramData = await Program.find({ id: Number(ProgramId)})
                .catch(err => {
                    Log.logger.info(`PROGRAM CONTROLLER ERROR: getting the data from db ${err}`);
                    res.status(500).json({status: 500 , msg: `Server error`});
                });
            if (ProgramData.length!=0){
                ProgramData = ProgramData[0];
                Log.logger.info(`PROGRAM CONTROLLER RES: get program number: ${ProgramId}`);
                res.json(ProgramData);
            }
            else{
                Log.logger.info(`PROGRAM CONTROLLER RES: Didn't find program number: ${ProgramId}`);
                res.status(404).json({status: 404 , msg: `Didn't find program number: ${ProgramId}`});
            }
        }
    },
    async createProgram(req, res) {
        Log.logger.info(`PROGRAM CONTROLLER REQ: POST add an program`);
        const body = req.body;
        var ProgramId = await Program.find()
            .catch(err => {
                Log.logger.info(`PROGRAM CONTROLLER ERROR: getting the data from db ${err}`);
                res.status(500).json({status: 500 , msg: `Server error`});
        });
        if (ProgramId.length!=0)
            ProgramId = ProgramId[(ProgramId.length)-1].id+1;
        else
            ProgramId=1;
        if (body.name && body.startSource &&
            body.startDelay && body.finishSource && body.finishDelay){
                const newProgram = new Program({
                    "name": body.name,
                    "startSource": body.startSource,
                    "startDelay": body.startDelay,
                    "finishSource": body.finishSource,
                    "finishDelay": body.finishDelay,
                    "id": ProgramId,
                    "currentStatus": 0
                });
                const result = newProgram.save();
                if (result) {
                    Log.logger.info(`PROGRAM CONTROLLER RES: add program number ${ProgramId}`);
                    res.json(newProgram);
                } else {
                    Log.logger.info(`PROGRAM CONTROLLER ERROR: getting the data from db ${err}`);
                    res.status(500).json({status: 500 , msg: `Server error`});
                }
        } else {
            Log.logger.info(`PROGRAM CONTROLLER RES: Input error!`);
            res.status(400).json({status: 400 , msg: `Input error!`});
        }
    },
    async updateProgram(req, res) {
        const ProgramId = req.path.substring(1);
        Log.logger.info(`PROGRAM CONTROLLER REQ: update an program number: ${ProgramId}`);
        if (isNaN(ProgramId)){
            Log.logger.info(`PROGRAM CONTROLLER RES: input is nan error "${ProgramId}"`);
            res.status(400).json({status: 400 , msg: `Input is nan error "${ProgramId}"`});
        }
        else {
            var body = req.body;
            var newProgram = await Program.find({ id: Number(ProgramId)})
                .catch(err => {
                    Log.logger.info(`PROGRAM CONTROLLER ERROR: getting the data from db ${err}`);
                    res.status(500).json({status: 500 , msg: `Server error`});
                });
            if (newProgram.length == 0){
                Log.logger.info(`PROGRAM CONTROLLER RES: Didn't find program number: ${ProgramId}`);
                res.status(404).json({status: 404 , msg: `Didn't find program number: "${ProgramId}"`});
            }
            else {
                newProgram = newProgram[0];
                if (body.name)
                    newProgram.name=body.name;
                if (body.startSource)
                    newProgram.startSource=body.startSource;
                if (body.startDelay)
                    newProgram.startDelay=body.startDelay;
                if (body.finishSource)
                    newProgram.finishSource=body.finishSource;
                if (body.finishDelay)
                    newProgram.finishDelay=body.finishDelay;
                if (body.currentStatus == 0 || body.currentStatus == 1 )
                    newProgram.currentStatus=body.currentStatus;
                Program.updateOne({ id: ProgramId }, {
                    name: newProgram.name,
                    startSource: newProgram.startSource,
                    startDelay: newProgram.startDelay,
                    finishSource: newProgram.finishSource,
                    finishDelay: newProgram.finishDelay,
                    currentStatus: newProgram.currentStatus
                })
                    .catch(err => {
                        Log.logger.info(`PROGRAM CONTROLLER ERROR: update program ${err}`);
                        res.status(500).json({status: 500 , msg: `Error update a program`});
                    });
                res.json(body)
            }
        }
    },
    async deleteProgram(req, res) {
        const ProgramId = req.path.substring(1)
        Log.logger.info(`PROGRAM CONTROLLER REQ: Get specific program number ${ProgramId}`);
        if (isNaN(ProgramId)){
            Log.logger.info(`PROGRAM CONTROLLER RES: input is nan error "${ProgramId}"`);
            res.status(400).json({status: 400 , msg: `Input is nan error "${ProgramId}"`});
        }
        else{
            Log.logger.info(`PROGRAM CONTROLLER RES: delete program number: ${ProgramId}`);
            Program.deleteOne ({ id: Number(ProgramId)})
                .then(docs => { res.json(docs)})
                .catch(err => {
                    Log.logger.info(`PROGRAM CONTROLLER ERROR: deleting program from db: ${err}`);
                    res.status(500).json({status: 500 , msg: `Server delete error`});
                });
        }
    }
};
