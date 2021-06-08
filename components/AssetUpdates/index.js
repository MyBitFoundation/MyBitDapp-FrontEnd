import React from 'react';
import styled from 'styled-components';
import { Comment, List } from 'antd';
import dayjs from 'dayjs';
import Panel from 'UI/Panel';

const AssetUpdatesTitle = styled.p`
  font-size: 20px;
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  display: inline-block;
  padding-top: 10px;
}`;

class AssetUpdates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      author: 'Loading...',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=',
    };
  }

  async componentWillMount() {
    const {
      getPosts, asset, getProfile, getAvatar,
    } = this.props;
    const [
      posts,
      author,
      avatar,
    ] = await Promise.all([
      asset && asset.assetId && asset.assetManager
        ? await getPosts(asset.assetId, asset.assetManager) : [],
      getProfile(asset.assetManager),
      getAvatar(asset.assetManager),
    ]);
    // order posts by date in desc order
    posts.reverse();
    const postsWithoutEmptyMessages = posts.filter(post => post.message && post.message !== '');
    this.setState({ posts: postsWithoutEmptyMessages, author, avatar });
  }

  render() {
    const { loadingThreeBox } = this.props;
    const { posts, author, avatar } = this.state;
    const numberOfPosts = posts.length;
    return (
      <Panel
        maximizeForMobile
        style={{
          maxHeight: '500px',
          overflowY: 'auto',
          marginTop: '20px',
        }}
      >
        <AssetUpdatesTitle>Updates from Asset Manager</AssetUpdatesTitle>
        {
          loadingThreeBox
            ? (
              <p>
            Loading updates from Asset Manager...
              </p>
            ) : numberOfPosts === 0
              ? (
                <p>
              No updates from the asset manager.
                </p>
              )
              : (
                <List
                  header={numberOfPosts === 1 ? `${numberOfPosts} update` : `${numberOfPosts} updates`}
                  itemLayout="horizontal"
                  dataSource={posts}
                  renderItem={post => (
                    <li>
                      <Comment
                        author={author.name}
                        avatar={avatar}
                        content={post.message}
                        datetime={dayjs(post.timestamp * 1000).format('ddd, MMM D, H:mm:ss')}
                      />
                    </li>
                  )}
                />
              )
        }
      </Panel>
    );
  }
}

export default AssetUpdates;
