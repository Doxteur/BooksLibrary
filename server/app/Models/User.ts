import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, HasOne,hasOne } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Profile from './Profile'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({serializeAs: null})
  public password: string

  @column()
  public roleId: number

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>
}
