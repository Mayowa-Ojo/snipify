import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   CreateDateColumn,
   UpdateDateColumn,
   OneToMany,
   ManyToOne,
   JoinColumn
} from "typeorm";

import User from "./user.entity";
import File from "./file.entity";
import Collection from "./collection.entity";
import Comment from "./comment.entity";
import { Permissions } from "~declarations/enums";

@Entity("snips")
class Snip {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column({
      type: "varchar",
   })
   title: string;

   @Column({
      type: "text",
   })
   description: string;

   @Column({
      type: "int",
      default: 0
   })
   stars: number;

   @Column({
      type: "int",
      default: 0
   })
   forks: number;

   @Column({
      name: "permission",
      type: "enum",
      enum: Permissions,
      default: Permissions.PUBLIC
   })
   permission: Permissions;

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

   @ManyToOne(() => User, (author: User) => author.snips, {
      onDelete: "CASCADE"
   })
   @JoinColumn({ name: "author_id" })
   author: User;

   @ManyToOne(() => Collection, (collection: Collection) => collection.snips, {})
   @JoinColumn({ name: "collection_id" })
   collection: Collection;

   @OneToMany(() => File, (file: File) => file.snip, {
      cascade: ["insert", "update"]
   })
   files: File[];

   @OneToMany(() => Comment, (comment: Comment) => comment.snip, {
      cascade: ["insert", "update"]
   })
   comments: Comment[];
}

export default Snip;
