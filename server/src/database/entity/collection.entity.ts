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

@Entity("collections")
class Collection {
   @PrimaryGeneratedColumn("uuid")
   id: string

   @Column({
      type: "varchar",
      unique: true
   })
   name: string

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

   @OneToMany(() => Snip, (snip: Snip) => snip.collection, {
      cascade: ["insert", "update"]
   })
   snips: Snip[];

   @ManyToOne(() => User, (user: User) => user.collections, {
      onDelete: "CASCADE"
   })
   @JoinColumn({ name: "owner_id" })
   owner: User;
}

export default Collection;