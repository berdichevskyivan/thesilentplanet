import { withStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: 'black',
    color: 'lime',
    maxWidth: 220,
    marginBottom:8,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid lime',
  },
}))(Tooltip);

export default HtmlTooltip;
