import { Trans } from "@lingui/macro";
import { Confirm } from "reactjs-components";
import PropTypes from "prop-types";
import React from "react";
import ModalHeading from "#SRC/js/components/modals/ModalHeading";

class JobStopRunModal extends React.Component {
  getContentHeader(selectedItems, selectedItemsLength) {
    let headerContent = ` ${selectedItemsLength} Job Runs`;
    if (selectedItemsLength === 1) {
      headerContent = "this";
    }

    return (
      <ModalHeading key="confirmHeader">
        <Trans render="span">
          Are you sure you want to stop {headerContent}?
        </Trans>
      </ModalHeading>
    );
  }

  getConfirmTextBody(selectedItems, selectedItemsLength) {
    let bodyText;

    if (selectedItemsLength === 1) {
      bodyText = `the job run with id ${selectedItems[0]}`;
    } else {
      bodyText = "the selected job runs";
    }

    return (
      <span key="confirmText">
        <Trans render="span">You are about to stop {bodyText}.</Trans>
      </span>
    );
  }

  render() {
    const { onClose, onSuccess, open, selectedItems, disabled } = this.props;
    const selectedItemsLength = selectedItems.length;
    let rightButtonText = "Stop Job Run";

    if (selectedItemsLength > 1) {
      rightButtonText = "Stop Job Runs";
    }

    return (
      <Confirm
        closeByBackdropClick={true}
        disabled={disabled}
        header={this.getContentHeader(selectedItems, selectedItemsLength)}
        open={open}
        onClose={onClose}
        leftButtonText="Cancel"
        leftButtonCallback={onClose}
        leftButtonClassName="button button-primary-link"
        rightButtonText={rightButtonText}
        rightButtonClassName="button button-danger"
        rightButtonCallback={onSuccess}
        showHeader={true}
      >
        <div className="text-align-center">
          {this.getConfirmTextBody(selectedItems, selectedItemsLength)}
        </div>
      </Confirm>
    );
  }
}

JobStopRunModal.defaultProps = {
  onSuccess() {}
};

JobStopRunModal.propTypes = {
  jobID: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  open: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  selectedItems: PropTypes.array.isRequired
};

export default JobStopRunModal;
