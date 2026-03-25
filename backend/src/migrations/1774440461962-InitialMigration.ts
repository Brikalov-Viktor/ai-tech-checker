import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1774440461962 implements MigrationInterface {
    name = 'InitialMigration1774440461962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "interview_id" uuid NOT NULL, "question_id" integer NOT NULL, "user_answer_text" text NOT NULL, "is_correct" boolean, "ai_mark" integer, "ai_feedback" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_08977c1a2a5f1b8b472dbd87d04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."questions_difficulty_enum" AS ENUM('easy', 'medium', 'hard')`);
        await queryRunner.query(`CREATE TABLE "questions" ("id" SERIAL NOT NULL, "text" text NOT NULL, "correct_answer" text NOT NULL, "difficulty" "public"."questions_difficulty_enum" NOT NULL DEFAULT 'medium', "subject_id" integer NOT NULL, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subjects" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text, CONSTRAINT "UQ_47a287fe64bd0e1027e603c335c" UNIQUE ("name"), CONSTRAINT "PK_1a023685ac2b051b4e557b0b280" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "position_subjects" ("id" SERIAL NOT NULL, "position_id" integer NOT NULL, "subject_id" integer NOT NULL, "weight" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_0863ffb7b33efdc8ba5817c4280" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "positions" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "description" text, "config" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2bd490ef22317945030a836dbc9" UNIQUE ("title"), CONSTRAINT "PK_17e4e62ccd5749b289ae3fae6f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."interviews_status_enum" AS ENUM('in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "interviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "position_id" integer, "status" "public"."interviews_status_enum" NOT NULL DEFAULT 'in_progress', "score" double precision, "recommendations" jsonb, "started_at" TIMESTAMP NOT NULL DEFAULT now(), "completed_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fd41af1f96d698fa33c2f070f47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."users_grade_enum" AS ENUM('junior', 'junior+', 'middle', 'middle+', 'senior')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "login" character varying(100) NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "grade" "public"."users_grade_enum", "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_answers" ADD CONSTRAINT "FK_127d2850a45e5971e4b86e2aeb4" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_answers" ADD CONSTRAINT "FK_adae59e684b873b084be36c5a7a" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_bab312bafb550a655ece4bca116" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "position_subjects" ADD CONSTRAINT "FK_6197738776a41a59aafa4a17d2f" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "position_subjects" ADD CONSTRAINT "FK_149006a36758d70047a3592d0d5" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interviews" ADD CONSTRAINT "FK_b6fa4e1fab2f948fb14c736cd7a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interviews" ADD CONSTRAINT "FK_18f2fe18aff423aaa36dc9258a9" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interviews" DROP CONSTRAINT "FK_18f2fe18aff423aaa36dc9258a9"`);
        await queryRunner.query(`ALTER TABLE "interviews" DROP CONSTRAINT "FK_b6fa4e1fab2f948fb14c736cd7a"`);
        await queryRunner.query(`ALTER TABLE "position_subjects" DROP CONSTRAINT "FK_149006a36758d70047a3592d0d5"`);
        await queryRunner.query(`ALTER TABLE "position_subjects" DROP CONSTRAINT "FK_6197738776a41a59aafa4a17d2f"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_bab312bafb550a655ece4bca116"`);
        await queryRunner.query(`ALTER TABLE "user_answers" DROP CONSTRAINT "FK_adae59e684b873b084be36c5a7a"`);
        await queryRunner.query(`ALTER TABLE "user_answers" DROP CONSTRAINT "FK_127d2850a45e5971e4b86e2aeb4"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_grade_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "interviews"`);
        await queryRunner.query(`DROP TYPE "public"."interviews_status_enum"`);
        await queryRunner.query(`DROP TABLE "positions"`);
        await queryRunner.query(`DROP TABLE "position_subjects"`);
        await queryRunner.query(`DROP TABLE "subjects"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TYPE "public"."questions_difficulty_enum"`);
        await queryRunner.query(`DROP TABLE "user_answers"`);
    }

}
