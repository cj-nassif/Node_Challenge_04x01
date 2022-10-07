import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Create Statement", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
    })  
    it("should be able to create a new deposit", async () => {
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
            amount: 100,
            description: "depósito restituição"
        }

        const createDeposit = await createStatementUseCase.execute({
            user_id: deposit.user_id,
            type: deposit.type as OperationType,
            amount: deposit.amount,
            description: deposit.description
        })
      
       expect(createDeposit).toHaveProperty("id");
    })

    it("should not be able to make a withdraw without funds", async () => {
       expect(async () => {
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
            type: "withdraw",
            amount: 100,
            description: "aluguel"
        }

        await createStatementUseCase.execute({
            user_id: deposit.user_id,
            type: deposit.type as OperationType,
            amount: deposit.amount,
            description: deposit.description
        })
       }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
        
    })

})