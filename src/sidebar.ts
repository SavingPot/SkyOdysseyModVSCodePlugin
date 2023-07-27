import * as vscode from "vscode";
import { Uri } from "vscode";

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
    for (let index = 0; index < 13; index++) {
      var str: string = "";
      var command: string = "";
      var icon: Uri | vscode.ThemeIcon;

      switch (index) {
        case 0:
          str = "创建项目";
          command = "spgamemodextension.project.create";
          icon = new vscode.ThemeIcon("add");
          break;

        case 1:
          str = "更新项目";
          command = "spgamemodextension.project.update";
          icon = new vscode.ThemeIcon("checklist");
          break;

        case 2:
          str = "重载窗口";
          command = "workbench.action.reloadWindow";
          icon = new vscode.ThemeIcon("refresh");
          break;

        case 3:
          str = "添加音效";
          command = "spgamemodextension.project.generation.audio";
          icon = new vscode.ThemeIcon("bell");
          break;

        case 4:
          str = "添加纹理";
          command = "spgamemodextension.project.generation.texture";
          icon = new vscode.ThemeIcon("file-media");
          break;

        case 5:
          str = "创建方块";
          command = "spgamemodextension.project.generation.block";
          icon = new vscode.ThemeIcon("chrome-maximize");
          break;

        case 6:
          str = "创建实体";
          command = "spgamemodextension.project.generation.entity";
          icon = new vscode.ThemeIcon("squirrel");
          break;

        case 7:
          str = "创建物品";
          command = "spgamemodextension.project.generation.item";
          icon = new vscode.ThemeIcon("gift");
          break;

        case 8:
          str = "创建群系";
          command = "spgamemodextension.project.generation.biome";
          icon = new vscode.ThemeIcon("symbol-snippet");
          break;

        case 9:
          str = "创建语言";
          command = "spgamemodextension.project.generation.language";
          icon = new vscode.ThemeIcon("globe");
          break;

        case 10:
          str = "创建配方";
          command = "spgamemodextension.project.generation.recipe";
          icon = new vscode.ThemeIcon("output");
          break;

        case 11:
          str = "创建咒语";
          command = "spgamemodextension.project.generation.spell";
          icon = new vscode.ThemeIcon("sparkle");
          break;

        case 12:
          str = "创建结构";
          command = "spgamemodextension.project.generation.structure";
          icon = new vscode.ThemeIcon("home");
          break;

        default:
          throw new Error();
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
      item.iconPath = icon; //vscode.Uri.file("close"); // 在这里设置按钮图标
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
      var icon: Uri | vscode.ThemeIcon;

      switch (index) {
        case 0:
          str = "导出";
          command = "spgamemodextension.debug.build";
          icon = new vscode.ThemeIcon("export");
          break;

        case 1:
          str = "导出并运行";
          command = "spgamemodextension.debug.build_and_run";
          icon = new vscode.ThemeIcon("check");
          break;

        case 2:
          str = "清理导出";
          command = "spgamemodextension.debug.clean";
          icon = new vscode.ThemeIcon("trash");
          break;

        case 3:
          str = "运行游戏";
          command = "spgamemodextension.debug.run";
          icon = new vscode.ThemeIcon("run");
          break;

        case 4:
          str = "关闭游戏";
          command = "spgamemodextension.debug.stop";
          icon = new vscode.ThemeIcon("close");
          break;

        default:
          throw new Error();
      }

      var item = new BuildEntryItem(str, vscode.TreeItemCollapsibleState.None);
      item.command = {
        command: command, //命令id
        title: "标题",
        arguments: [str], //命令接收的参数
      };
      item.iconPath = icon; //vscode.Uri.file("close"); // 在这里设置按钮图标
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
      var icon: Uri | vscode.ThemeIcon;

      switch (index) {
        case 0:
          str = "打包";
          command = "spgamemodextension.release.package";
          icon = new vscode.ThemeIcon("file-zip");
          break;

        case 1:
          str = "发布";
          command = "spgamemodextension.release.publish";
          icon = new vscode.ThemeIcon("cloud-upload");
          break;

        default:
          throw new Error();
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
      item.iconPath = icon; //vscode.Uri.file("close"); // 在这里设置按钮图标
      children[index] = item;
    }
    return children;
  }
}

// 树节点
export class GitEntryItem extends vscode.TreeItem {}

//树的内容组织管理
export class GitEntryList implements vscode.TreeDataProvider<GitEntryItem> {
  onDidChangeTreeData?:
    | vscode.Event<void | GitEntryItem | null | undefined>
    | undefined;

  getTreeItem(
    element: GitEntryItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: GitEntryItem): vscode.ProviderResult<GitEntryItem[]> {
    //子节点
    var children = [];
    for (let index = 0; index < 4; index++) {
      var str: string = "";
      var command: string = "";
      var icon: Uri | vscode.ThemeIcon;

      switch (index) {
        case 0:
          str = "重新添加所有文件";
          command = "spgamemodextension.git.readd-all-files";
          icon = new vscode.ThemeIcon("refresh");
          break;

        case 1:
          str = "撤销上次更改";
          command = "spgamemodextension.git.revert-last-change";
          icon = new vscode.ThemeIcon("arrow-left");
          break;

        case 2:
          str = "撤销上上次更改";
          command = "spgamemodextension.git.revert-before-last-change";
          icon = new vscode.ThemeIcon("debug-reverse-continue");
          break;

        case 3:
          str = "重置上传目标分支";
          command = "spgamemodextension.git.reset-upstream-branch";
          icon = new vscode.ThemeIcon("debug-restart");
          break;

        default:
          throw new Error();
      }

      var item = new GitEntryItem(str, vscode.TreeItemCollapsibleState.None);
      item.command = {
        command: command, //命令id
        title: "标题",
        arguments: [str], //命令接收的参数
      };
      item.iconPath = icon; //vscode.Uri.file("close"); // 在这里设置按钮图标
      children[index] = item;
    }
    return children;
  }
}
