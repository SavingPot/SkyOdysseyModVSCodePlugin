import * as vscode from "vscode";

// 树节点
export class ProjectEntryItem extends vscode.TreeItem {}

//树的内容组织管理
export class ProjectEntryList
  implements vscode.TreeDataProvider<ProjectEntryItem>
{
  onDidChangeTreeData?:
    | vscode.Event<void | ProjectEntryItem | null | undefined>
    | undefined;
  getTreeItem(
    element: ProjectEntryItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(
    element?: ProjectEntryItem
  ): vscode.ProviderResult<ProjectEntryItem[]> {
    //子节点
    var children = [];
    for (let index = 0; index < 3; index++) {
      var str: string = "";
      var command: string = "";

      switch (index) {
        case 0:
          str = "创建项目";
          command = "spgamemodextension.project.create";
          break;

        case 1:
          str = "更新项目";
          command = "spgamemodextension.project.update";
          break;

        case 2:
          str = "重载窗口";
          command = "workbench.action.reloadWindow";
          break;

        case 3:
          str = "创建方块";
          command = "spgamemodextension.project.generation.block";
          break;
      }

      var item = new ProjectEntryItem(
        str,
        vscode.TreeItemCollapsibleState.None
      );
      item.command = {
        command: command, //命令id
        title: "标题",
        arguments: [str], //命令接收的参数
      };
      children[index] = item;
    }
    return children;
  }
}

// 树节点
export class BuildEntryItem extends vscode.TreeItem {}

//树的内容组织管理
export class BuildEntryList implements vscode.TreeDataProvider<BuildEntryItem> {
  onDidChangeTreeData?:
    | vscode.Event<void | BuildEntryItem | null | undefined>
    | undefined;
  getTreeItem(
    element: BuildEntryItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(
    element?: BuildEntryItem
  ): vscode.ProviderResult<BuildEntryItem[]> {
    //子节点
    var children = [];
    for (let index = 0; index < 5; index++) {
      var str: string = "";
      var command: string = "";

      switch (index) {
        case 0:
          str = "导出";
          command = "spgamemodextension.debug.build";
          break;

        case 1:
          str = "导出并运行";
          command = "spgamemodextension.debug.build_and_run";
          break;

        case 2:
          str = "清理导出";
          command = "spgamemodextension.debug.clean";
          break;

        case 3:
          str = "运行游戏";
          command = "spgamemodextension.debug.run";
          break;

        case 4:
          str = "关闭游戏";
          command = "spgamemodextension.debug.stop";
          break;
      }

      var item = new BuildEntryItem(str, vscode.TreeItemCollapsibleState.None);
      item.command = {
        command: command, //命令id
        title: "标题",
        arguments: [str], //命令接收的参数
      };
      children[index] = item;
    }
    return children;
  }
}

// 树节点
export class ReleaseEntryItem extends vscode.TreeItem {}

//树的内容组织管理
export class ReleaseEntryList
  implements vscode.TreeDataProvider<ReleaseEntryItem>
{
  onDidChangeTreeData?:
    | vscode.Event<void | ReleaseEntryItem | null | undefined>
    | undefined;
  getTreeItem(
    element: ReleaseEntryItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(
    element?: ReleaseEntryItem
  ): vscode.ProviderResult<ReleaseEntryItem[]> {
    //子节点
    var children = [];
    for (let index = 0; index < 2; index++) {
      var str: string = "";
      var command: string = "";

      switch (index) {
        case 0:
          str = "打包";
          command = "spgamemodextension.release.package";
          break;

        case 1:
          str = "发布";
          command = "spgamemodextension.release.publish";
          break;
      }

      var item = new ReleaseEntryItem(
        str,
        vscode.TreeItemCollapsibleState.None
      );
      item.command = {
        command: command, //命令id
        title: "标题",
        arguments: [str], //命令接收的参数
      };
      children[index] = item;
    }
    return children;
  }
}
