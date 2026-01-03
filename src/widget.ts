import { Widget } from '@lumino/widgets';
import { CommandRegistry } from '@lumino/commands';

/**
 * Interface for cached command information
 */
interface ICommandInfo {
  id: string;
  label: string;
  caption: string;
  args: string | null;
}

/**
 * A widget that displays all registered JupyterLab commands
 */
export class CommandsReferenceWidget extends Widget {
  private _commands: CommandRegistry;
  private _searchInput!: HTMLInputElement;
  private _countSpan!: HTMLSpanElement;
  private _tbody!: HTMLTableSectionElement;
  private _commandsCache: ICommandInfo[] = [];
  private _argsCache: Map<string, string> = new Map();

  constructor(commands: CommandRegistry) {
    super();
    this._commands = commands;
    this.addClass('jp-CommandsReferenceWidget');

    // Build DOM structure
    this._buildHeader();
    this._buildContent();

    // Initial load
    void this._loadCommands();
  }

  /**
   * Build the header with search input and count
   */
  private _buildHeader(): void {
    const header = document.createElement('div');
    header.className = 'jp-CommandsReferenceWidget-header';

    // Search input
    this._searchInput = document.createElement('input');
    this._searchInput.type = 'text';
    this._searchInput.placeholder = 'Filter commands...';
    this._searchInput.className = 'jp-CommandsReferenceWidget-search';
    this._searchInput.addEventListener('input', () => {
      this._filterCommands();
    });
    header.appendChild(this._searchInput);

    // Command count
    this._countSpan = document.createElement('span');
    this._countSpan.className = 'jp-CommandsReferenceWidget-count';
    header.appendChild(this._countSpan);

    this.node.appendChild(header);
  }

  /**
   * Build the content area with commands table
   */
  private _buildContent(): void {
    const content = document.createElement('div');
    content.className = 'jp-CommandsReferenceWidget-content';

    const table = document.createElement('table');
    table.className = 'jp-CommandsReferenceWidget-table';

    // Table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Command ID', 'Label', 'Description', 'Arguments'];
    for (const headerText of headers) {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body
    this._tbody = document.createElement('tbody');
    table.appendChild(this._tbody);

    content.appendChild(table);
    this.node.appendChild(content);
  }

  /**
   * Load all commands from the registry
   */
  private async _loadCommands(): Promise<void> {
    try {
      const commandIds = this._commands.listCommands();
      console.log(`Commands Reference: Found ${commandIds.length} commands`);
      this._commandsCache = [];

      for (const id of commandIds) {
        let label = '';
        let caption = '';

        // Some commands have label/caption functions that may fail without args
        try {
          label = this._commands.label(id) || '';
        } catch {
          label = '';
        }

        try {
          caption = this._commands.caption(id) || '';
        } catch {
          caption = '';
        }

        const info: ICommandInfo = {
          id,
          label,
          caption,
          args: null
        };
        this._commandsCache.push(info);
      }

      // Sort by command ID
      this._commandsCache.sort((a, b) => a.id.localeCompare(b.id));

      // Render initial table
      this._renderTable(this._commandsCache);

      // Load arguments asynchronously
      void this._loadArguments();
    } catch (error) {
      console.error('Commands Reference: Error loading commands', error);
    }
  }

  /**
   * Load command arguments asynchronously
   */
  private async _loadArguments(): Promise<void> {
    const batchSize = 50;
    const commands = this._commandsCache;

    for (let i = 0; i < commands.length; i += batchSize) {
      const batch = commands.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async cmd => {
          try {
            const description = await this._commands.describedBy(cmd.id);
            if (description && description.args) {
              const argsStr = this._formatArgs(description.args);
              cmd.args = argsStr;
              this._argsCache.set(cmd.id, argsStr);

              // Update the cell if visible
              this._updateArgsCell(cmd.id, argsStr);
            }
          } catch {
            // Command may not have describedBy implemented
          }
        })
      );

      // Yield to allow UI updates
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  /**
   * Format arguments object as readable string
   * Handles JSON Schema format: { type: "object", properties: { argName: { type: "string" } } }
   */
  private _formatArgs(args: unknown): string {
    if (!args || typeof args !== 'object') {
      return '';
    }

    const schema = args as Record<string, unknown>;

    // JSON Schema format: extract from 'properties' object
    if (schema.properties && typeof schema.properties === 'object') {
      const properties = schema.properties as Record<string, unknown>;
      const propKeys = Object.keys(properties);

      if (propKeys.length === 0) {
        return '';
      }

      const formatted = propKeys.map(key => {
        const prop = properties[key];
        if (prop && typeof prop === 'object') {
          const propObj = prop as Record<string, unknown>;
          const typeInfo = propObj.type;
          if (typeInfo) {
            return `${key}: ${typeInfo}`;
          }
        }
        return key;
      });

      return formatted.join(', ');
    }

    // Fallback: direct key-value format (non-schema)
    const keys = Object.keys(schema).filter(k => k !== 'type' && k !== '$schema');
    if (keys.length === 0) {
      return '';
    }

    return keys.join(', ');
  }

  /**
   * Update a specific args cell in the table
   */
  private _updateArgsCell(commandId: string, argsStr: string): void {
    const rows = Array.from(this._tbody.querySelectorAll('tr'));
    for (const row of rows) {
      const idCell = row.querySelector('td:first-child');
      if (idCell && idCell.textContent === commandId) {
        const argsCell = row.querySelector('td:nth-child(4)') as HTMLElement | null;
        if (argsCell) {
          argsCell.textContent = argsStr;
          argsCell.title = argsStr;
        }
        break;
      }
    }
  }

  /**
   * Render the commands table
   */
  private _renderTable(commands: ICommandInfo[]): void {
    this._tbody.innerHTML = '';

    for (const cmd of commands) {
      const row = document.createElement('tr');

      // Command ID cell
      const idCell = document.createElement('td');
      idCell.className = 'jp-CommandsReferenceWidget-commandId';
      idCell.textContent = cmd.id;
      idCell.title = cmd.id;
      row.appendChild(idCell);

      // Label cell
      const labelCell = document.createElement('td');
      labelCell.textContent = cmd.label;
      labelCell.title = cmd.label;
      row.appendChild(labelCell);

      // Description cell
      const descCell = document.createElement('td');
      descCell.textContent = cmd.caption;
      descCell.title = cmd.caption;
      row.appendChild(descCell);

      // Arguments cell
      const argsCell = document.createElement('td');
      const cachedArgs = this._argsCache.get(cmd.id);
      argsCell.textContent = cachedArgs || cmd.args || '';
      argsCell.title = cachedArgs || cmd.args || '';
      row.appendChild(argsCell);

      this._tbody.appendChild(row);
    }

    this._updateCount(commands.length, this._commandsCache.length);
  }

  /**
   * Filter commands based on search input
   */
  private _filterCommands(): void {
    const query = this._searchInput.value.toLowerCase().trim();

    if (!query) {
      this._renderTable(this._commandsCache);
      return;
    }

    const filtered = this._commandsCache.filter(cmd => {
      return (
        cmd.id.toLowerCase().includes(query) ||
        cmd.label.toLowerCase().includes(query) ||
        cmd.caption.toLowerCase().includes(query)
      );
    });

    this._renderTable(filtered);
  }

  /**
   * Update the command count display
   */
  private _updateCount(shown: number, total: number): void {
    if (shown === total) {
      this._countSpan.textContent = `${total} commands`;
    } else {
      this._countSpan.textContent = `${shown} / ${total} commands`;
    }
  }

  /**
   * Refresh the commands list
   */
  refresh(): void {
    this._argsCache.clear();
    void this._loadCommands();
  }
}
