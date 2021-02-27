import { EntityRepository, Repository } from "typeorm";
import { Survey } from "../src/models/Survey";

@EntityRepository(Survey)
class SurveysRepository extends Repository<Survey> {
}

export { SurveysRepository };