import { Trans } from "@lingui/macro";
import PropTypes from "prop-types";
import React from "react";

import DCOSStore from "#SRC/js/stores/DCOSStore";
import ConfigurationMapHeading from "#SRC/js/components/ConfigurationMapHeading";
import ConfigurationMapLabel from "#SRC/js/components/ConfigurationMapLabel";
import ConfigurationMapRow from "#SRC/js/components/ConfigurationMapRow";
import ConfigurationMapSection from "#SRC/js/components/ConfigurationMapSection";
import ConfigurationMapValue from "#SRC/js/components/ConfigurationMapValue";
import TaskStates from "../constants/TaskStates";

class MarathonTaskDetailsList extends React.Component {
  getTaskPorts(task) {
    const { ports } = task;
    if (!ports || !ports.length) {
      return "None";
    }

    return ports.join(", ");
  }

  getTaskStatus(task) {
    if (task == null || task.state == null) {
      return "Unknown";
    }

    return TaskStates[task.state].displayName;
  }

  getTimeField(time) {
    let timeString = "Never";

    if (time != null) {
      timeString = new Date(time).toLocaleString();
    }

    return (
      <time dateTime={time} title={time}>
        {timeString}
      </time>
    );
  }

  getMarathonTaskDetails(task) {
    if (task == null) {
      return null;
    }

    return (
      <ConfigurationMapSection>
        <ConfigurationMapHeading>
          <Trans render="span">Marathon Task Configuration</Trans>
        </ConfigurationMapHeading>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <Trans render="span">Host</Trans>
          </ConfigurationMapLabel>
          <ConfigurationMapValue>{task.host}</ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <Trans render="span">Ports</Trans>
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getTaskPorts(task)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <Trans render="span">Status</Trans>
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            <Trans id={this.getTaskStatus(task)} render="span" />
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <Trans render="span">Staged at</Trans>
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getTimeField(task.stagedAt)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <Trans render="span">Started at</Trans>
          </ConfigurationMapLabel>
          <ConfigurationMapValue>
            {this.getTimeField(task.startedAt)}
          </ConfigurationMapValue>
        </ConfigurationMapRow>
        <ConfigurationMapRow>
          <ConfigurationMapLabel>
            <Trans render="span">Version</Trans>
          </ConfigurationMapLabel>
          <ConfigurationMapValue>{task.version}</ConfigurationMapValue>
        </ConfigurationMapRow>
      </ConfigurationMapSection>
    );
  }

  getMarathonTaskHealthCheckResults(task) {
    if (task == null || task.healthCheckResults == null) {
      return null;
    }

    return task.healthCheckResults.map((result, i) => {
      let consecutiveFailures = result.consecutiveFailures;
      let alive = "Yes";
      const healthCheckResultNum = i + 1;
      if (consecutiveFailures == null) {
        consecutiveFailures = "None";
      }

      if (!result.alive) {
        alive = "No";
      }

      return (
        <ConfigurationMapSection key={i}>
          <ConfigurationMapHeading>
            <Trans render="span">
              Health Check Result {healthCheckResultNum}
            </Trans>
          </ConfigurationMapHeading>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <Trans render="span">First success</Trans>
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {this.getTimeField(result.firstSuccess)}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <Trans render="span">Last success</Trans>
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {this.getTimeField(result.lastSuccess)}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <Trans render="span">Last failure</Trans>
            </ConfigurationMapLabel>
            <ConfigurationMapValue>
              {this.getTimeField(result.lastFailure)}
            </ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <Trans render="span">Consecutive failures</Trans>
            </ConfigurationMapLabel>
            <ConfigurationMapValue>{consecutiveFailures}</ConfigurationMapValue>
          </ConfigurationMapRow>
          <ConfigurationMapRow>
            <ConfigurationMapLabel>
              <Trans render="span">Alive</Trans>
            </ConfigurationMapLabel>
            <ConfigurationMapValue>{alive}</ConfigurationMapValue>
          </ConfigurationMapRow>
        </ConfigurationMapSection>
      );
    });
  }

  render() {
    const marathonTask = DCOSStore.serviceTree.getTaskFromTaskID(
      this.props.taskID
    );
    const taskConfiguration = this.getMarathonTaskDetails(marathonTask);
    const healthCheckResults = this.getMarathonTaskHealthCheckResults(
      marathonTask
    );

    return (
      <ConfigurationMapSection>
        {taskConfiguration}
        {healthCheckResults}
      </ConfigurationMapSection>
    );
  }
}

MarathonTaskDetailsList.propTypes = {
  taskID: PropTypes.string.isRequired
};

module.exports = MarathonTaskDetailsList;
