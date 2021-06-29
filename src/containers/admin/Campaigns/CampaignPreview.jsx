import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from 'reactstrap';
import ReactPlayer from 'react-player';
import CampaignsPreviewHeader from './CampaignPreviewHeader';
import DefualtText from '../../../assets/images/text.png';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function removeLayerOffset() {
  const textLayers = document.querySelectorAll('.react-pdf__Page__textContent');
  textLayers.forEach((layer) => {
    const { style } = layer;
    style.display = 'none';
  });
}

class CampaignPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // file: '',
      imagePreviewUrl: '',
      numPages: null,
      pageNumber: 1
    };
    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  onDocumentLoadSuccess(document) {
    const { numPages } = document;
    this.setState({
      pageNumber: 1,
      numPages
    });
  }

  changePage(offset) {
    this.setState((prevState) => ({
      pageNumber: prevState.pageNumber + offset
    }));
  }

  previousPage() { this.changePage(-1); }

  nextPage() { this.changePage(1); }

  render() {
    const { numPages, pageNumber } = this.state;
    let { imagePreviewUrl } = this.state;
    let previewTitle = '';
    let $imagePreview = null;
    let extFile = '';
    if (localStorage.getItem('previewImage')) {
      imagePreviewUrl = localStorage.getItem('previewImage');
    }
    if (localStorage.getItem('previewTitle')) {
      previewTitle = localStorage.getItem('previewTitle');
    }
    if (imagePreviewUrl) {
      const ext = imagePreviewUrl.split('.').pop();
      extFile = ext;
      if (ext === 'jpg' || ext === 'png' || ext === 'svg') {
        $imagePreview = (<img src={imagePreviewUrl} alt={previewTitle} />);
      } else if (ext === 'mp4' || ext === 'MOV' || ext === 'WMV') {
        $imagePreview = (
          <ReactPlayer
            url={imagePreviewUrl}
            className="react-player"
            // playing
            width="100%"
            height={ext === 'mp3' ? '35%' : '100%'}
            controls
          />
        );
      } else if (ext === 'pdf') {
        $imagePreview = (
          <div>
            <nav>
              <Button
                onClick={() => this.changePage(-1)}
                value={numPages}
              >
                Prev
              </Button>
              <Button onClick={() => this.changePage(1)} style={{ position: 'absolute', right: 0 }}>Next</Button>
            </nav>
            <div className="text-center pdf-more">
              <div className="campaigninnerTitle">GS-2669 BE</div>
              <div className="campaigninnerTitle">$20000</div>
              <Button color="dark pdf-know-more">
                Know More
              </Button>
            </div>
            <Document
              className="imgPreview"
              file={imagePreviewUrl}
              onLoadSuccess={this.onDocumentLoadSuccess}
              option={{
                maxImageSize: 1
              }}
            >
              <Page
                pageNumber={pageNumber}
                onLoadSuccess={removeLayerOffset}
              />
            </Document>
          </div>
        );
      } else {
        $imagePreview = (<img src={DefualtText} alt={previewTitle} width="80" height="80" style={{ marginLeft: 90 }} />);
      }
    } else {
      $imagePreview = (<img src={DefualtText} alt={previewTitle} width="80" height="80" style={{ marginLeft: 90 }} />);
    }
    return (
      <div>
        <CampaignsPreviewHeader title={previewTitle} BtnContent="Draft" BtnRightContent="Edit" />
        <div className="MainPreview">
          <div className="campaign-container-preview center-box" style={{ height: extFile === 'pdf' ? '980px' : '818px' }}>
            {extFile === 'pdf'
              ? (
                <div style={{ position: 'relative', top: 52 }}>
                  { $imagePreview}
                </div>
              )
              : (
                <div className="previewComponent center-box">
                  <div className="previewComponent-inner align-center">
                    <div className="campaigninnerTitle heading-top">Charles Anderson has shared a product with you</div>
                    <hr className="hrline" />
                    <div className={(extFile === 'jpg' || extFile === 'png' || extFile === 'svg' || imagePreviewUrl === '') ? 'imgPreview' : 'vidPreview'}>
                      {$imagePreview}
                      <div className="text-center">
                        <div className="campaigninnerTitle">GS-2669 BE</div>
                        <div className="campaigninnerTitle">$20000</div>
                        <Button color="dark btn-more">
                          Know More
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="copy-text">HeyArrow @2020. All rights reserved</p>
                </div>
              )}
          </div>
          <div className="campaign-container-preview-right right-chat">
            <div className="chat-header">
              <div className="font-weight-bold">Chat</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CampaignPreview;
