import { Arg, Mutation, Resolver } from 'type-graphql';
import { Artist } from '../../../models/gql/artist/Artist';
import { Inject } from 'typedi';
import { DI } from '../../../constants/DI';
import * as AWS from 'aws-sdk';
import ArtistModel from '../../../models/dynamo/artist/ArtistSchema';

@Resolver()
export default class ArtistMutation {

  @Inject(DI.dynamodb)
  private readonly dynamodb: AWS.DynamoDB;

  @Mutation(returnType => Artist)
  public async artistAdd(
    @Arg('name') name: string
  ): Promise<Artist> {

    const params = {
      TableName: ArtistModel.TableName,
      Item: {
        name: {
          S: name
        },
        createdAt: {
          S: Date.now().toString()
        },
        symbol: {
          S: name.substr(0, 1).toUpperCase()
        }
      },
      ReturnConsumedCapacity: 'TOTAL'
    };

    await this.dynamodb.putItem(params).promise();
    const artist: Artist = new Artist();
    artist.name = params.Item.name.S;
    artist.createdAt = parseInt(params.Item.createdAt.S, 10);
    return artist;
  }

  @Mutation(returnType => Boolean)
  public async artistRemove(
    @Arg('id') id: string
  ): Promise<boolean> {
    await this.dynamodb.deleteItem({
      TableName: ArtistModel.TableName,
      Key: {
        symbol: {
          S: id.substr(0, 1).toUpperCase()
        },
        createdAt: {
          S: id.split(':')[1]
        }
      }
    }).promise();
    return true;
  }

}
