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

import Snip from "./snip.entity";
import User from "./user.entity";

@Entity("comments")
class Comment {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column({
      type: "text"
   })
   content: string;

   @Column({
      type: "int",
      default: 0
   })
   likes: number;

   @Column({
      type: "uuid",
      name: "liked_by",
      array: true,
      default: "{}"
   })
   likedBy: string[];

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

   @ManyToOne(() => Snip, (snip: Snip) => snip.comments, {
      onDelete: "CASCADE"
   })
   @JoinColumn({ name: "snip_id" })
   snip: Snip;

   @ManyToOne(() => User, (user: User) => user.comments, {
      onDelete: "CASCADE"
   })
   @JoinColumn({ name: "user_id" })
   author: User;

   @ManyToOne(() => Comment, (comment: Comment) => comment.replies, {
      onDelete: "CASCADE"
   })
   @JoinColumn({ name: "parent_id" })
   parent: Comment;

   @OneToMany(() => Comment, (comment: Comment) => comment.parent, {
      cascade: ["insert", "update"]
   })
   replies: Comment[];
}

export default Comment;