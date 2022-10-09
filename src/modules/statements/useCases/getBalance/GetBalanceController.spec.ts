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
        try {
         const deposit = await request(app)
        .post("/api/v1/statements/deposit")
        .send({
                amount: 800,
                description: "pix"
              }
        )
        .set({
            Authorization: `Bearer ${userToken}`
        });

        //console.log("DEPOSITO", deposit.body);


      const withdraw =  await request(app)
        .post("/api/v1/statements/withdraw")
        .send({
                amount: 150,
                description: "pix"
              }
        )
        .set({
            Authorization: `Bearer ${userToken}`
        });

        //console.log("SAQUE", withdraw.body);
   
        } catch (error) {
            console.log(error);
        } finally {
            const response = await request(app)
        .get("/api/v1/statements/balance")
        .set({
            Authorization: `Bearer ${userToken}`
        });

        console.log(response.body)

        expect(response.status).toBe(200);    
        expect(response.body).toHaveProperty("statement");
        expect(response.body).toHaveProperty("balance");  
        expect(response.body.balance).toEqual(650);
        expect(response.body.statement.length).toEqual(2);
        }
        
        
        
    });
    
})