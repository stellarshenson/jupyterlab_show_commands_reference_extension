import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';

import { CommandsReferenceWidget } from './widget';

/**
 * Command IDs for the extension
 */
namespace CommandIDs {
  export const open = 'jupyterlab-commands-reference:open';
}

/**
 * Track the widget instance to prevent duplicates
 */
let widget: MainAreaWidget<CommandsReferenceWidget> | null = null;

/**
 * Initialization data for the jupyterlab_show_commands_reference_extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_show_commands_reference_extension:plugin',
  description:
    'Display all available JupyterLab commands with their full reference IDs and arguments in a dedicated tab',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    console.log(
      'JupyterLab extension jupyterlab_show_commands_reference_extension is activated!'
    );

    // Register the command
    app.commands.addCommand(CommandIDs.open, {
      label: 'Show Commands Reference',
      caption: 'Display all available JupyterLab commands with their IDs and arguments',
      execute: () => {
        // Create widget if it doesn't exist or was disposed
        if (!widget || widget.isDisposed) {
          const content = new CommandsReferenceWidget(app.commands);
          widget = new MainAreaWidget({ content });
          widget.id = 'jp-commands-reference';
          widget.title.label = 'Commands Reference';
          widget.title.closable = true;

          // Clear reference when widget is disposed
          widget.disposed.connect(() => {
            widget = null;
          });
        }

        // Add to main area if not already attached
        if (!widget.isAttached) {
          app.shell.add(widget, 'main');
        }

        // Activate the widget
        app.shell.activateById(widget.id);
      }
    });

    // Add command to palette under Help category
    palette.addItem({
      command: CommandIDs.open,
      category: 'Help'
    });
  }
};

export default plugin;
