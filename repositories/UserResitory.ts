import { EntityRepository, Repository } from "typeorm";
import { User } from "../src/models/User";

@EntityRepository(User)
class UserRepository extends Repository<User> {
}

export { UserRepository };