const {
  app
} = require('../src/app');
const {
  asyncReadFile,
  asyncWriteFile
} = require('../src/dao')
const request = require('supertest');

describe("app", () => {
  describe("get request", () => {
    it("should get all accounts when request url pattern is '/api/tasks'", (done) => {
      app.locals.dataFilePath = "./test/fixture.json"
      request(app).get('/api/tasks').expect(200).expect([
        {
          "id": 1,
          "content": "Restful API homework",
          "createdTime": "2020-03-21T00:00:00Z"
        },
        {
          "id": 2,
          "content": "Restful API homework",
          "createdTime": "2020-03-21T00:00:11Z"
        }
      ]
      ).end((err, res) => {
        if (err) throw err;
        done()
      })
    })

    it("should get specific account when request url patten is '/api/tasks/:id'", (done) => {
      request(app).get('/api/tasks/1').expect(200).expect({
        "id": 1,
        "content": "Restful API homework",
        "createdTime": "2020-03-21T00:00:00Z"
      }).end((err, res) => {
        if (err) throw err;
        done()
      })
    })
  })
//post
  describe("post request", () => {
    afterEach(async function () {
      await asyncWriteFile(JSON.stringify([
        {
          "id": 1,
          "content": "Restful API homework",
          "createdTime": "2020-03-21T00:00:00Z"
        },
        {
          "id": 2,
          "content": "Restful API homework",
          "createdTime": "2020-03-21T00:00:11Z"
        }
      ]), "./test/fixture.json")
    })
    it("should create a account when the corresponding id does not exist in the datasource", (done) => {
      request(app).post('/api/tasks').send({
        "id": 3,
        "content": "Restful API homework",
        "createdTime": "2020-03-21T00:00:22Z"
      }).expect(201).expect([{
        "id": 1,
        "content": "Restful API homework",
        "createdTime": "2020-03-21T00:00:00Z"
      },
      {
        "id": 2,
        "content": "Restful API homework",
        "createdTime": "2020-03-21T00:00:11Z"
      },
      {
        "id": 3,
        "content": "Restful API homework",
        "createdTime": "2020-03-21T00:00:22Z"
      }
      ]).end((err, res) => {
        if (err) throw err;
        done()
      })
    })

    it("should not create the account when its id has already existed in the datasource", (done) => {
      request(app).post('/api/tasks').send({
        "id": 1,
        "content": "Restful API homework",
        "createdTime": "2020-03-21T00:00:33Z"
      }).expect(400).end((err, res) => {
        if (err) throw err;
        done()
      })
    })

     
   })
  //delete
  describe("delete request",()=>{
    afterEach(async function () {
        await asyncWriteFile(JSON.stringify([
          {
            "id": 1,
            "content": "Restful API homework",
            "createdTime": "2020-03-21T00:00:00Z"
          },
          {
            "id": 2,
            "content": "Restful API homework",
            "createdTime": "2020-03-21T00:00:11Z"
          }
        ]), "./test/fixture.json")
      })
     
      it("should delete the task when its id has already existed in the datasource", (done) => {
        request(app).delete('/api/tasks/1').expect(204).end((err, res) => {
          if (err) throw err;
          done()
        })
      })
      it("should not delete the task when its id does not exist in the datasource", (done) => {
        request(app).delete('/api/tasks/3').expect(404).end((err, res) => {
          if (err) throw err;
          done()
        })
      })
  })
   

})
