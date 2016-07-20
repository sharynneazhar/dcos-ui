const classNames = require('classnames');
/* eslint-disable no-unused-vars */
const React = require('react');
/* eslint-enable no-unused-vars */
import {Tooltip} from 'reactjs-components';

const HealthSorting = require('../constants/HealthSorting');
import Icon from '../components/Icon';
const MarathonStore = require('../stores/MarathonStore');
import TableUtil from '../utils/TableUtil';
import TimeAgo from '../components/TimeAgo';
import Util from '../utils/Util';

const LEFT_ALIGN_PROPS = [
  'cpus',
  'disk',
  'log',
  'mem',
  'mtime',
  'priority',
  'size'
];

function leftAlignCaret(prop) {
  return LEFT_ALIGN_PROPS.includes(prop);
}

function getUpdatedTimestamp(model) {
  let lastStatus = Util.last(model.statuses);
  return lastStatus && lastStatus.timestamp || null;
}

var ResourceTableUtil = {
  getClassName: function (prop, sortBy, row) {
    return classNames({
      'text-align-right': leftAlignCaret(prop) || prop === 'TASK_RUNNING',
      'hidden-mini': leftAlignCaret(prop),
      'highlight': prop === sortBy.prop,
      'clickable': row == null // this is a header
    });
  },

  getSortFunction: function (tieBreakerProp) {
    return TableUtil.getSortFunction(tieBreakerProp, function (item, prop) {
      if (prop === 'updated') {
        return getUpdatedTimestamp(item) || 0;
      }

      if (prop === 'health') {
        return HealthSorting[
          MarathonStore.getServiceHealth(item.get('name')).key
        ];
      }

      if (prop === 'cpus' || prop === 'mem' || prop === 'disk') {
        // This is necessary for tasks, since they are not structs
        let value = item[prop];

        if (!value && item.get) {
          value = item.get(prop);
        }

        if (item.getUsageStats) {
          value = item.getUsageStats(prop).value;
        }

        if (Util.findNestedPropertyInObject(item, `resources.${prop}`)) {
          value = item.resources[prop];
        }

        if (Array.isArray(value)) {
          return Util.last(value).value;
        }

        return value;
      }

      // This is necessary for tasks, since they are not structs
      if (!item.get) {
        return item[prop];
      }

      return item.get(prop);
    });
  },

  renderHeading: function (config) {
    return function (prop, order, sortBy) {
      let title = config[prop];
      let caret = {
        before: null,
        after: null
      };
      let caretClassSet = classNames(
        `caret caret--${order}`,
        {'caret--visible': prop === sortBy.prop}
      );
      let helpIcon = null;

      if (leftAlignCaret(prop) || prop === 'TASK_RUNNING') {
        caret.before = <span className={caretClassSet} />;
      } else {
        caret.after = <span className={caretClassSet} />;
      }

      if (this.helpText != null) {
        helpIcon = (
          <Tooltip
            content={this.helpText}
            wrapText={true}
            wrapperClassName="tooltip-wrapper text-align-center table-header-help-icon">
            <Icon id="ring-question" size="mini" family="mini" color="grey" />
          </Tooltip>
        );
      }

      return (
        <span>
          {caret.before}
          <span className="table-header-title">{title}</span>
          {helpIcon}
          {caret.after}
        </span>
      );
    };
  },

  renderUpdated: function (prop, model) {
    let updatedAt = getUpdatedTimestamp(model);

    if (updatedAt == null) {
      return 'N/A';
    }

    let ms = updatedAt.toFixed(3) * 1000;

    return <TimeAgo time={ms} />;
  },

  renderTask: function (prop, model) {
    return (
      <span>
        {model[prop]}
        <span className="visible-mini-inline"> Tasks</span>
      </span>
    );
  }
};

module.exports = ResourceTableUtil;
