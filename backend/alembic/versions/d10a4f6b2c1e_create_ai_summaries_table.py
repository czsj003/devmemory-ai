"""create ai summaries table

Revision ID: d10a4f6b2c1e
Revises: a2d74f48c91e
Create Date: 2026-07-10 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "d10a4f6b2c1e"
down_revision: Union[str, Sequence[str], None] = "a2d74f48c91e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "ai_summaries",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), nullable=False),
        sa.Column("type", sa.String(length=50), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["project_id"],
            ["projects.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_ai_summaries_id"),
        "ai_summaries",
        ["id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_ai_summaries_project_id"),
        "ai_summaries",
        ["project_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_ai_summaries_project_id"), table_name="ai_summaries")
    op.drop_index(op.f("ix_ai_summaries_id"), table_name="ai_summaries")
    op.drop_table("ai_summaries")
