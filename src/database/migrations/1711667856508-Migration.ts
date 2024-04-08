import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1711667856508 implements MigrationInterface {
    name = 'Migration1711667856508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_610102b60fea1455310ccd299d" UNIQUE ("userId"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post" ADD "likes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "tastes" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profilePicture" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "coverPicture" character varying`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coverPicture"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profilePicture"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tastes"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "likes"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    }

}
