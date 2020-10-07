import { Arg, Mutation, Resolver } from 'type-graphql';
import { Song } from '../../../models/gql/song/Song';
import { Inject } from 'typedi';
import { DI } from '../../../constants/DI';
import * as AWS from 'aws-sdk';
import SongModel from '../../../models/dynamo/song/SongSchema';
import { GenreType } from '../../../../../../rds/app/src/constants/GenreType';
import * as bunyan from 'bunyan';

@Resolver()
export default class SongMutation {

  @Inject(DI.dynamodb)
  private readonly dynamodb: AWS.DynamoDB;

  @Inject(DI.logger)
  private readonly logger: bunyan;

  @Mutation(returnType => Song)
  public async songAdd(
    @Arg('name') name: string,
    @Arg('releaseDate') releaseDate: number,
    @Arg('genreType') genreType: GenreType,
    @Arg('artistId') artistId: string
  ): Promise<Song> {

    const params = {
      TableName: SongModel.TableName,
      Item: {
        name: {
          S: name
        },
        genreType: {
          N: genreType.toString()
        },
        releaseDate: {
          S: releaseDate.toString()
        },
        artistId: {
          S: artistId
        },
        id: {
          S: `${genreType}#${releaseDate}`
        }
      },
      ReturnConsumedCapacity: 'TOTAL'
    };

    const {ConsumedCapacity } = await this.dynamodb.putItem(params).promise();
    this.logger.info(`consumed ${ ConsumedCapacity.CapacityUnits } units for adding song`);
    const song: Song = new Song();
    song.name = params.Item.name.S;
    song.genreType = parseInt(params.Item.genreType.N, 10);
    song.releaseDate = parseInt(params.Item.releaseDate.S, 10);
    song.artistId = params.Item.artistId.S;
    song.id = params.Item.id.S;
    return song;
  }

  @Mutation(returnType => Boolean)
  public async songRemove(
    @Arg('artistId') artistId: string,
    @Arg('id') id: string
  ): Promise<boolean> {
    const { ConsumedCapacity } = await this.dynamodb.deleteItem({
      TableName: SongModel.TableName,
      Key: {
        id: {
          S: id
        },
        artistId: {
          S: artistId
        }
      },
      ReturnConsumedCapacity: 'TOTAL'
    }).promise();
    this.logger.info(`consumed ${ ConsumedCapacity.CapacityUnits } units for removing song`);
    return true;
  }

}
