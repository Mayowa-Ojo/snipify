import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   CreateDateColumn,
   UpdateDateColumn,
   ManyToOne,
   JoinColumn
} from "typeorm";

import Snip from "./snip.entity";

@Entity("files")
class File {
   @PrimaryGeneratedColumn("uuid")
   id: string

   @Column({
      type: "varchar",
      length: 255
   })
   filename: string

   @Column({
      type: "varchar",
      length: 255
   })
   language: string

   @Column({
      name: "object_key",
      type: "text"
   })
   objectKey: string

   @Column({
      name: "object_location",
      type: "text"
   })
   objectLocation: string

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

   @ManyToOne(() => Snip, (snip: Snip) => snip.files, {
      onDelete: "CASCADE"
   })
   @JoinColumn({ name: "snip_id" })
   snip: Snip;
}

export default File;