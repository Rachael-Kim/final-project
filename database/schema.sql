set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

set client_min_messages to warning;
-- DANGER: this is NOT how to do it in the real world.
-- "drop schema" INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
	"user_id" serial,
	"email" TEXT NOT NULL UNIQUE,
	"hashed_password" TEXT NOT NULL,
	"created_at" TIMESTAMP NOT NULL default now(),
	PRIMARY KEY ("user_id")
);

CREATE TABLE "listings" (
	"listing_id" serial,
	"is_cat_friendly" BOOLEAN NOT NULL,
	"is_dog_friendly" BOOLEAN NOT NULL,
	"home_type" TEXT NOT NULL,
	"num_of_rooms" integer NOT NULL,
	"city" TEXT NOT NULL,
	"state" TEXT NOT NULL,
	"price"integer NOT NULL,
	"title_property" TEXT NOT NULL,
	"description" TEXT NOT NULL,
	"timestamp" TIMESTAMP NOT NULL default now(),
	"url" TEXT NOT NULL,
	PRIMARY KEY ("listing_id")
);

CREATE TABLE "favorites" (
	"favorite_id" serial,
	"listing_id"integer NOT NULL,
	"user_id"integer NOT NULL,
	"timestamp" TIMESTAMP NOT NULL default now(),
	PRIMARY KEY ("favorite_id")
);

ALTER TABLE "favorites" ADD CONSTRAINT "favorites_fk0" FOREIGN KEY ("listing_id") REFERENCES "listings"("listing_id");
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");
