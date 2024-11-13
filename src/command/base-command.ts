export interface BaseCommand {
  execute(): Promise<void>;
}
