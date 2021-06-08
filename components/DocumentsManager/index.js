import React from 'react';
import styled, { css } from 'styled-components';
import {
  Button,
  Icon,
} from 'antd';
import UploadButton from 'UI/UploadButton';
import {
  MAX_FILES_UPLOAD,
  MAX_FILE_SIZE,
} from 'constants/app';
import CloseIcon from 'static/ic_close.svg';
import { InternalLinks } from 'constants/links';
import FileImg from 'static/file-icon.svg';
import * as Brain from '../../apis/brain';
import DocumentsManagerTitle from './documentsManagerTitle';
import DocumentsManagerNav from './documentsManagerNav';
import DocumentsManagerDescription from './documentsManagerDescription';
import DocumentsManagerFile from './documentsManagerFile';
import DocumentsManagerList from './documentsManagerList';
import DocumentsManagerWrapper from './documentsManagerWrapper';
import DocumentsManagerError from './documentsManagerError';
import DocumentsManagerNoFiles from './documentsManagerNoFiles';
import { withBlockchainContext } from 'components/BlockchainContext';
import ChangesButtonWithLabel from 'components/ChangesButtonWithLabel';

const CloseIconWrapper = styled(CloseIcon)`
  position: absolute;
  right: 0px;
  top: 0px;
  transform: translate(0%,100%);
  cursor: pointer;
`;

const ChangesWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 0px;
  padding: 0% 10%;
  bottom: 30px;

  button{
    margin-left: 20px;
    width: 124px;
  }
`;

class DocumentsManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: this.props.files || [],
      error: undefined,
      filesTmp: [],
    };
  }

  handleFileUploaded = (file) => {
    const { asset } = this.props;
    const { files = [] } = asset;
    const { filesTmp } = this.state;

    const uploadedFiles = file.target.files;
    const currentNumberOfFiles = files.length + filesTmp.length;
    const uploadedNumberOfFiles = uploadedFiles.length;
    const canUpload = MAX_FILES_UPLOAD - currentNumberOfFiles;

    let error;
    if (currentNumberOfFiles + uploadedNumberOfFiles > MAX_FILES_UPLOAD) {
      error = 'A maximum of 5 files can be uploaded.';
      this.setState({
        error,
      });
      return;
    }
    let counter = 0;
    const hasRepeatedNames = false;
    for (file of Object.values(uploadedFiles)) {
      if (file.size > MAX_FILE_SIZE) {
        error = 'Some files are over 5MB. They were skipped.';
      } else {
        filesTmp.push({ name: file.name, deletable: true, file });
        counter += 1;
        if (counter === canUpload && counter !== 1) {
          break;
        }
      }
    }

    if (filesTmp.length > 0) {
      this.setState({
        filesTmp,
        error,
      });
    }
  }

  handleRemoveUpload = (fileName) => {
    const { uploading } = this.state;
    if (!uploading) {
      this.setState(prevState => ({
        filesTmp: prevState.filesTmp.filter(file => file.name !== fileName),
      }));
    }
  }

  upload = async (files, propsFiles) => {
    const { asset } = this.props;
    const { assetId } = asset;
    const { updateAssetListingIpfs } = this.props.blockchainContext;
    const result = await Brain.uploadFilesToAWS(this.props.assetId, files);
    if (result) {
      const assetWithUpdatedFiles = { ...asset, files: asset.files ? [...asset.files] : [] };
      // update asset object with new files
      files.forEach((file) => {
        assetWithUpdatedFiles.files.push(file);
      });
      updateAssetListingIpfs(assetWithUpdatedFiles, (success) => {
        this.setState({ uploading: false, filesTmp: success ? [] : files });
      });
    }
  }

  handleFileUpload = () => {
    try {
      const { filesTmp } = this.state;
      const { files = [] } = this.props;
      this.setState({ uploading: true });
      this.upload(filesTmp, files);
    } catch (err) {
      console.error(err);
      this.setState({ uploading: false });
    }
  }

  render = () => {
    const { asset } = this.props;
    const { files = [], assetId } = asset;
    const {
      error,
      success,
      uploading,
      filesTmp,
    } = this.state;

    const noFiles = files.length === 0 && filesTmp.length === 0;
    const noFilesToUpload = filesTmp.length === 0;
    const reachedMaxFiles = filesTmp.length + files.length >= MAX_FILES_UPLOAD;
    return (
      <DocumentsManagerWrapper>
        <DocumentsManagerTitle>Supporting Documents</DocumentsManagerTitle>
        {/* <DocumentsManagerNav>
          <UploadButton
            inputProps={{
              onChange: this.handleFileUploaded,
              multiple: true,
            }}
          >
            <Button
              size="large"
              type="file"
              disabled={reachedMaxFiles}
            >
              {reachedMaxFiles ? 'Max 5 files' : 'Documents'}
            </Button>
          </UploadButton>
          <UploadButton
            inputProps={{
              onChange: this.handleFileUploaded,
              multiple: true,
            }}
          >
            <Icon type="upload" />
          </UploadButton>
          <DocumentsManagerDescription>
            Up to a maximum of 5 files can be uploaded, a maximum of 5MB each. Files cannot be removed.
          </DocumentsManagerDescription>
        </DocumentsManagerNav> */}
        {!noFiles && (
          <DocumentsManagerList>
            {files.concat(filesTmp).map((file, index) => (
              <DocumentsManagerFile key={`file${index}`}>
                <div>
                  <FileImg />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={file.url}
                  >
                    {file.filename}
                  </a>
                  {file.deletable && (
                  <CloseIconWrapper onClick={this.handleRemoveUpload.bind(this, file.name || file)} />
                  )}
                </div>
              </DocumentsManagerFile>
            ))}
          </DocumentsManagerList>
        )}
        {/* {(!noFiles || !noFilesToUpload) && (
          <ChangesButtonWithLabel
            onClick={this.handleFileUpload}
            loading={uploading}
            loadingText="Uploading"
            changes={!noFilesToUpload}
          />
        )} */}
        {noFiles && (
          <DocumentsManagerNoFiles />
        )}
        {error && (
          <DocumentsManagerError
            color="orange"
          >
            <Icon type="warning" />
            <span>{error}</span>
            <Icon type="cross" onClick={() => this.setState({ error: undefined })} />
          </DocumentsManagerError>
        )}
        {success && (
          <DocumentsManagerError
            color="green"
          >
            <Icon type="check" />
            <span>{`${success} file(s) successfully uploaded.`}</span>
            <Icon type="cross" onClick={() => this.setState({ success: undefined })} />
          </DocumentsManagerError>
        )}
      </DocumentsManagerWrapper>
    );
  }
}

export default withBlockchainContext(DocumentsManager);
