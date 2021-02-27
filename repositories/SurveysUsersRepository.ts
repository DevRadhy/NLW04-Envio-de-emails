import { EntityRepository, Repository } from "typeorm";
import { SurveysUser } from "../src/models/SurveyUser";

@EntityRepository(SurveysUser)
class SurveysUsersRepository extends Repository<SurveysUser> {}

export { SurveysUsersRepository };