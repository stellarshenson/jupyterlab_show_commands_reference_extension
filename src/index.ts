import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab_show_commands_reference_extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_show_commands_reference_extension:plugin',
  description: 'Jupyterlab custom command that opens a new tab where there is a long list of currently available commands with their full reference ( i.e. iframe:open ) along with the list of arguments - as extracted in realtime from the available commands some way. Page is supposed to serve the purpose of being reference help page for those who want to use the commands',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_show_commands_reference_extension is activated!');
  }
};

export default plugin;
