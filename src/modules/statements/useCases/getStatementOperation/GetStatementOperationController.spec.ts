import { Connection, createConnection } from 'typeorm';
import request from "supertest";
import { app } from '../../../../app';

let connection: Connection;
let userToken: string;

describe("Get balance", () => {
    beforeAll(async () => {
       connection = await createConnection();
       await connection.runMigrations();

       await request(app).post("/api/v1/users").send({
        name: "Bel",
        email: "bel@gmail.com",
        password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
        email: "bel@gmail.com",
        password: "1234"
    });

    const { token } = responseToken.body;
    
    userToken = token;

    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
      });

    it("should be able to get balance", async () => {

        await request(app)
        .post("/api/v1/statements/deposit")
        .send({
                amount: 800,
                description: "pix"
              }
        )
        .set({
            Authorization: `Bearer ${userToken}`
        });
        
        const responseOperation = await request(app)
        .post("/api/v1/statements/deposit")
        .send({
                amount: 100,
                description: "pix"
              }
        )
        .set({
            Authorization: `Bearer ${userToken}`
        });

        //console.log("RESPONSE OPERATION",responseOperation.body)

        const response = await request(app)
        .get(`/api/v1/statements/${responseOperation.body.id}`)
        .set({
            Authorization: `Bearer ${userToken}`
        });

        console.log(response.body)

        expect(response.status).toBe(200);    
        expect(response.body).toHaveProperty("id");
        expect(response.body.amount).toEqual("100.00");
    });
    
})
