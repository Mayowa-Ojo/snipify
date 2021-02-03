import {
   Entity,
   PrimaryGeneratedColumn,
   CreateDateColumn,
   UpdateDateColumn,
   Column,
   OneToMany,
   ManyToMany,
   JoinTable,
} from "typeorm";

import Snip from "./snip.entity";
import Collection from "./collection.entity";
import Comment from "./comment.entity";

@Entity("users")
class User {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column({
      type: "varchar",
      length: 255
   })
   name: string;

   @Column({
      type: "varchar",
      length: 255,
      name: "github_id"
   })
   githubId: string;

   @Column({
      type: "varchar",
      length: 255,
   })
   avatar: string;

   @Column({
      type: "uuid",
      array: true,
      default: "{}"
   })
   starred: string[];

   @CreateDateColumn({
      name: "created_at",
      type: "timestamp"
   })
   createdAt: Date;

   @UpdateDateColumn({
      name: "updated_at",
      type: "timestamp"
   })
   updatedAt: Date;

   @OneToMany(() => Snip, (snip: Snip) => snip.author, {
      cascade: ["insert", "update"]
   })
   snips: Snip[];

   @OneToMany(() => Collection, (collection: Collection) => collection.owner, {
      cascade: ["insert", "update"]
   })
   collections: Collection[];

   @OneToMany(() => Comment, (comment: Comment) => comment.author, {
      cascade: ["insert", "update"]
   })
   comments: Comment[];
}

export default User;