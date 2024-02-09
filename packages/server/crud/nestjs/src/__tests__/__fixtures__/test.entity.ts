import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'

import { TestEntityRelationEntity } from './test-entity-relation.entity'
import { TestRelation } from './test-relation.entity'
import { TestSoftDeleteRelation } from './test-soft-delete.relation'

@Entity()
export class TestEntity {
  @PrimaryColumn({ name: 'test_entity_pk' })
  testEntityPk!: string

  @Column({ name: 'string_type' })
  stringType!: string

  @Column({ name: 'bool_type' })
  boolType!: boolean

  @Column({ name: 'number_type' })
  numberType!: number

  @Column({ name: 'date_type' })
  dateType!: Date

  @OneToMany('TestRelation', 'testEntity')
  testRelations?: TestRelation[]

  @ManyToOne(() => TestRelation, {
    nullable: true
  })
  @JoinColumn({ name: 'many_to_one_relation_id' })
  manyToOneRelation?: TestRelation

  @ManyToOne(() => TestSoftDeleteRelation, {
    nullable: true
  })
  @JoinColumn({ name: 'many_to_one_soft_delete_relation_id' })
  oneSoftDeleteTestRelation?: TestSoftDeleteRelation

  @ManyToMany(() => TestRelation, (tr) => tr.manyTestEntities, { onDelete: 'CASCADE', nullable: false })
  @JoinTable()
  manyTestRelations?: TestRelation[]

  @ManyToMany(() => TestRelation, { onDelete: 'CASCADE', nullable: false })
  @JoinTable()
  manyToManyUniDirectional?: TestRelation[]

  @OneToOne(() => TestRelation, (relation) => relation.oneTestEntity)
  @JoinColumn()
  oneTestRelation?: TestRelation

  @OneToMany(() => TestEntityRelationEntity, (ter) => ter.testEntity)
  testEntityRelation?: TestEntityRelationEntity
}
