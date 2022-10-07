import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "../getStatementOperation/GetStatementOperationUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";



let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Get balance", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementRepository, inMemoryUsersRepository)
    })  
    it("should be able to get balance by user id", async () => {
        const user = {
            name: "Vanessa",
	        email: "vanessa@gmail.com",
            password: "1234"
        }

        const userCreated = await createUserUseCase.execute({
            name: user.name,
	        email: user.email,
            password: user.password
        });

        const deposit = {
            user_id: userCreated.id!,
            type: "deposit",
            amount: 1000,
            description: "depósito restituição"
        }

        const createDeposit = await createStatementUseCase.execute({
            user_id: deposit.user_id,
            type: deposit.type as OperationType,
            amount: deposit.amount,
            description: deposit.description
        });

        const withdraw = {
            user_id: userCreated.id!,
            type: "withdraw",
            amount: 100,
            description: "aluguel"
        }

        await createStatementUseCase.execute({
            user_id: withdraw.user_id,
            type: withdraw.type as OperationType,
            amount: withdraw.amount,
            description: withdraw.description
        })

       const getBalance = await getBalanceUseCase.execute({
        user_id: createDeposit.user_id
       })
        console.log(getBalance)
        expect(getBalance).toHaveProperty("statement");
        expect(getBalance.balance).toEqual(900);

    })

    it("should not be able to get a balance to a non existent user", async () => {
       expect(async () => {

       await getBalanceUseCase.execute({
        user_id: "1212121212"
       })
       }).rejects.toBeInstanceOf(GetBalanceError)
        
    })

})