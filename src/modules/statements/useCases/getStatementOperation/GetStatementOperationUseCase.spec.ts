import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

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
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
    })  
    it("should be able to get a statement by id", async () => {
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
        });

       const getStatement = await getStatementOperationUseCase.execute({
        user_id: createDeposit.user_id, 
        statement_id: createDeposit.id!
       })
//console.log(getStatement)
       expect(getStatement).toHaveProperty("id");
       expect(getStatement.amount).toEqual(100);

    })

    it("should not be able to get a statement inexistent", async () => {
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
            type: "deposit",
            amount: 100,
            description: "depósito restituição"
        }

        const createDeposit = await createStatementUseCase.execute({
            user_id: deposit.user_id,
            type: deposit.type as OperationType,
            amount: deposit.amount,
            description: deposit.description
        });

        await getStatementOperationUseCase.execute({
        user_id: createDeposit.user_id, 
        statement_id: "1231244325345"
       })
       }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
        
    })

})